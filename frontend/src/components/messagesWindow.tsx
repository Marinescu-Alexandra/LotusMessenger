import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import profilePicturePlaceholder from '@/profilePicturePlaceholder.png'
import dots from '@/dots.png'
import close from '@/close.png'
import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { messageSend, uploadImages, seenMessage, deliverMessage, getFriends, getLastMessages, deliverUnsentMessages, markUnseenMessagesAsRead } from "@/store/actions/messengerAction";
import { getSharedMedia, updateSharedMedia } from '@/store/actions/selectedFriendAction'
import LeftChatBubble from "./leftChatBubble";
import RightChatBubble from "./rightChatBubble";
import moment from 'moment'
import imgBg from '@/bg.png'
import plus from '@/plus.png'
import GalleryView from "./galleryView";
import { RiSendPlaneFill } from "react-icons/ri";
import { PiSmileyLight } from "react-icons/pi";
import { GoPaperclip } from "react-icons/go";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import toast from 'react-hot-toast'
import { socket } from "@/socket"
import { SocketTypingMessage, Message, SocketUser } from "@/ts/interfaces/interfaces";

interface MessagesWindowProps {
    className?: string,
    activeUsers?: SocketUser[]
}

const MessagesWinow: FC<MessagesWindowProps> = ({ className, activeUsers }) => {

    // DOM CONSTANTS
    const chatWindow = document.getElementById('chatWindow');

    // ANIMATION VARIANTS 
    const variantsMessagesWindow = {
        open: { width: '60%' },
        closed: { width: '100%' },
    }

    const variantsContactInfo = {
        open: { width: ['0%', '40%'] },
        closed: { width: ['40%', '0%'] },
    }

    // REDUX STATE & DISPATCH
    const dispatch = useAppDispatch()
    const { myInfo } = useAppSelector(state => state.auth);
    const { selectedFriendData, sharedMedia } = useAppSelector(state => state.selectedFriend)
    const { friendsGetSuccess, messages, messageSendSuccess, imagePaths, lastMessages, messagesGetSuccess, lastMessagesGetSuccess, socketGetSuccess } = useAppSelector(state => state.messenger)

    // REACT STATES
    const [shouldScroll, setShouldScroll] = useState({state: true})

    const [newMessage, setNewMessage] = useState("")
    
    const [isContactInfoOpen, setContactInfoOpen] = useState(false)

    const [isSharedMediaOpen, setSharedMediaOpen] = useState(false)
    const [sharedMediaLength, setSharedMediaLength] = useState(3)
    const [isSharedMediaGalleryOpen, setSharedMediaGallery] = useState(false)
    const [sharedMediaGalleryIndex, setSharedMediaGalleryIndex] = useState(0)

    const inputFile = useRef<HTMLInputElement | null>(null);
    const [isMediaSelected, setMediaSelected] = useState(false)
    const [imageIndex, setImageIndex] = useState(0)
    
    const [isGalleryImageSelected, setGalleryImageSelected] = useState(false)
    const [galleryIndex, setGalleryIndex] = useState(0)
    const [galleryImages, setGalleryImages] = useState<string[]>([])

    const [socketMessage, setSocketMessage] = useState<Partial<Message>>({})
    const [typingMessage, setTypingMessage] = useState<Partial<SocketTypingMessage>>({})

    // HANDLERS
    const handleTextAreaInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value)
        if (myInfo) {
            socket.emit('typingMessage', {
                senderId: myInfo.id,
                receiverId: selectedFriendData._id,
                message: e.target.value
            })
        }
    }

    const handleSendMessage = () => {
        newMessage.trim()
        if ((newMessage !== "" && newMessage !== '\n') || imagePaths.length > 0) {
            const data = {
                senderName: myInfo.username,
                senderId: myInfo.id,
                receiverId: selectedFriendData._id,
                message: newMessage,
                images: imagePaths
            }

            if (myInfo) {
                socket.emit('typingMessage', {
                    senderId: myInfo.id,
                    receiverId: selectedFriendData._id,
                    message: ''
                })
            }

            updateShouldScroll()

            dispatch(messageSend(data))

            if (imagePaths.length > 0) {
                imagePaths.forEach((image: string) => dispatch(updateSharedMedia(image)));
            }
        }
    }

    const handleSelectMediaCliked = () => {
        if (inputFile.current) {
            inputFile.current.click()
        }
    }

    const handleImageGalleryClick = (index: number, paths: string[]) => {
        setGalleryIndex(index)
        setGalleryImages(paths)
        setGalleryImageSelected(true)
    }

    const handleGalleryClose = () => {
        setGalleryImageSelected(false)
        setSharedMediaGallery(false)
    }

    const handleSharedMediaClicked = () => {
        setSharedMediaOpen(!isSharedMediaOpen)
        if (sharedMediaLength === 3) {
            setSharedMediaLength(sharedMedia.length)
        } else {
            setSharedMediaLength(3)
        }
    }

    const handleSharedMediaImageClicked = (index: number) => {
        setSharedMediaGalleryIndex(index)
        setSharedMediaGallery(true)
        setGalleryImageSelected(false)
    }

    const handleMediaSelected = (e: ChangeEvent<HTMLInputElement>) => {

        const formData = new FormData()
        if (e.target.files) {
            let length = e.target.files.length
            if (e.target.files.length > 10) {
                length = 10
            }

            for (let i = 0; i < length; i++) {
                formData.append('fileToUpload[]', e.target.files[i]);
                formData.append('imageName[]', Date.now() + e.target.files[i].name);
            }
            dispatch(uploadImages(formData))
        }

    }

    const handleGetSharedMedia = () => {
        let sharedMedia: string[] = []
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].message.image.length > 0) {
                for (let j = 0; j < messages[i].message.image.length; j++) {
                    sharedMedia = [...sharedMedia, messages[i].message.image[j]]
                }
            }
        }
        dispatch(getSharedMedia(sharedMedia))
    }

    // FUNCTIONS
    function scrollToBottom() {
        if (chatWindow) {
            chatWindow.scroll({
                top: chatWindow.scrollHeight,
                left: 0,
                behavior: "smooth",
            });
        }
    }

    function updateShouldScroll() {
        if (chatWindow) {
            let scrollTop = Math.floor(chatWindow.scrollTop)
            let clientHeight = chatWindow.clientHeight
            let totalHeigth = chatWindow.scrollHeight
            if (scrollTop + clientHeight === totalHeigth || scrollTop + clientHeight === totalHeigth - 1) {
                setShouldScroll(prevState => { return { ...prevState, state: true } })
            } else {
                setShouldScroll(prevState => { return { ...prevState, state: false } })
            }
        }
    }

    function keyPressed(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
            setNewMessage("")

            if (isMediaSelected === true) {
                setMediaSelected(false)
                dispatch({ type: "UPLOAD_IMAGES_SUCCESS_CLEAR" })
            }
        }
    }

    // ===================================================================REACT HOOKS===================================================================

    // SCROLL IF NEEDED WHEN NEW MESSAGES ARE ADDED
    useEffect(() => {
        if (shouldScroll.state === true) {
            scrollToBottom();
        }
    }, [messageSendSuccess, messagesGetSuccess, socketGetSuccess])

    // OPEN GALERY VIEW WHEN USER FINISHED CHOOSING MEDIA TO SHARE
    useEffect(() => {
        if (imagePaths.length > 0) {
            setMediaSelected(true)
        } else {
            setMediaSelected(false)
        }
    }, [imagePaths])

    // UPDATE SHARED MEDIA LENGTH WHEN NEW IMAGES ARE SHARED
    useEffect(() => {
        if (isSharedMediaOpen === true) {
            setSharedMediaLength(sharedMedia.length)
        }
    }, [sharedMedia])

    // RESET SHARED MEDIA GALERY AND CONTACT INFO WHEN SWITCHING ACTIVE CHAT WINDOW
    useEffect(() => {
        setGalleryImageSelected(false)
        setMediaSelected(false)
        setSharedMediaGallery(false)
        setSharedMediaGalleryIndex(0)
        setSharedMediaOpen(false)
        setSharedMediaLength(3)
    }, [selectedFriendData._id])

    useEffect(() => {
        if (messagesGetSuccess) {
            dispatch({
                type: 'MESSAGE_GET_SUCCESS_CLEAR',
            })
        }
    }, [messagesGetSuccess])

    //IF LAST MESSAGE INFO OF CURRENT ACTIVE CHAT IS UPDATED, UPDATE MESSAGES OF CURRENT ACTIVE CHAT ALSO
    useEffect(() => {
        if (messages.length > 0 && lastMessages[selectedFriendData._id] && messages[messages.length - 1]._id === lastMessages[selectedFriendData._id]._id) {
            
            if (messages[messages.length - 1].status !== lastMessages[selectedFriendData._id].status) {
                dispatch({
                    type: 'UPDATE_MESSAGES',
                    payload: {
                        status: lastMessages[selectedFriendData._id].status
                    }
                })
            } 
        }
    }, [messageSendSuccess, messagesGetSuccess, socketGetSuccess, [lastMessages[selectedFriendData._id]]])

    // ===================================================================REAL TIME UPDATES FROM SOCKET SERVER===================================================================

    // GET LAST MESSAGES WHEN SOCKET USER RECEIVED OR SAW THE MESSAGES OF THE CURRENT USER AFTER GETTING ONLINE
    useEffect(() => {
        socket.on('updateLastMessageAsSeen', (data: Message) => { 
            dispatch(getLastMessages())
        })

        socket.on('updateLastMessageAsDelivered', (data: Message) => {
            dispatch(getLastMessages())
        })
    }, [lastMessagesGetSuccess])

    // UPDATE FRIEND LIST WHEN USERS CHANGE THEIR PROFILE INFO
    useEffect(() => {
        socket.on('updateFriendList', (userId: string) => {
            dispatch(getFriends())
        })
    },[friendsGetSuccess])

    // RECEIVE SOCKET MESSAGE, AND UPDATE LASTMESSAGE IF SOCKET USER IS ACTIVELY CHATTING WITH CURRENT USER
    useEffect(() => {
        socket.on('getMessage', (data: Message) => {
            setSocketMessage(data)
        })

        socket.on('socketMessageSeen', (data: Message) => {
            dispatch({
                type: 'UPDATE_LAST_MESSAGE_INFO',
                payload: {
                    id: data.receiverId,
                    messageInfo: data
                }
            })
        })

        socket.on('socketMessageDelivered', (data: Message) => {
            dispatch({
                type: 'UPDATE_LAST_MESSAGE_INFO',
                payload: {
                    id: data.receiverId,
                    messageInfo: data
                }
            })
        })
    }, [socketMessage])

    // SET TYPING MESSAGE
    useEffect(() => {
        socket.on('typingMessageGet', (data: SocketTypingMessage) => {
            setTypingMessage(data)
        })
    }, [typingMessage])

    // ===================================================================SOCKET EMITORS===================================================================

    // UPDATE ALL UNUNDELIVERED MESSAGES AS DELIVERED ON EACH RENDER
    useEffect(() => {
        for (const friendId in lastMessages) {
            if (lastMessages[friendId].status === 'undelivered' && lastMessages[friendId].receiverId === myInfo.id) {
                dispatch(deliverUnsentMessages(friendId))

                // REAL TIME UPDATE
                socket.emit('deliverMessages', lastMessages[friendId])
            }
        }
    }, [lastMessagesGetSuccess])

    // UPDATE ALL DELIVERED MESSAGES AS SEEN FOR FIRST RENDER OF ACTIVE CHAT WINDOW
    useEffect(() => {
        if (lastMessages[selectedFriendData._id] && selectedFriendData && (lastMessages[selectedFriendData._id].status === 'delivered' || lastMessages[selectedFriendData._id].status === 'undelivered') && lastMessages[selectedFriendData._id].receiverId === myInfo.id) {
            dispatch(markUnseenMessagesAsRead(selectedFriendData._id))
            dispatch(getLastMessages())

            // REAL TIME UPDATE
            socket.emit('seenMessages', lastMessages[selectedFriendData._id])
        }
    }, [selectedFriendData._id])

    // UPDATE THE SELECTED FRIEND WHEN NEW MESSAGE WAS SENT AND UPDATE LAST MESSAGE INFO OF SELECTED FRIEND
    useEffect(() => {
        if (messageSendSuccess) {
            if (myInfo) {
                socket.emit('sendMessage', messages[messages.length - 1])
                dispatch({
                    type: 'UPDATE_LAST_MESSAGE_INFO',
                    payload: {
                        messageInfo: messages[messages.length - 1],
                        id: selectedFriendData._id
                    }
                })
            }
            dispatch({
                type: 'MESSAGE_SEND_SUCCESS_CLEAR'
            })
        }
    }, [messageSendSuccess])

    // GET REAL TIME MESSAGE IN ACTIVE CHAT WINDOW AND DECIDE WHETHER SCROLL TO BOTTOM IS NEEDED OR NOT
    useEffect(() => {
        if (socketMessage && Object.keys(selectedFriendData).length > 0) {
            if (socketMessage.senderId === selectedFriendData._id && socketMessage.receiverId === myInfo.id) {
                updateShouldScroll()
            }
        }
    }, [socketMessage])

    // AFTER SHOULDSCROLL WAS UPDATED GET SOCKET MESSAGE AND MARK IT AS SEEN
    useEffect(() => {
        if (socketMessage && Object.keys(selectedFriendData).length > 0) {
            if (socketMessage.senderId === selectedFriendData._id && socketMessage.receiverId === myInfo.id) {

                dispatch({
                    type: 'SOCKET_MESSAGE',
                    payload: {
                        message: socketMessage
                    }
                })

                dispatch(seenMessage(socketMessage._id || ''))

                if (socketMessage.message?.image) {
                    socketMessage.message?.image.forEach((image: string) => dispatch(updateSharedMedia(image)));
                }

                socket.emit('messageSeen', { ...socketMessage, status: 'seen' })
            }

            setSocketMessage({})
        }
    }, [shouldScroll])

    // SEND USER NOTIFICATION WHEN RECEIVING REAL TIME MESSAGES FROM A DIFFERENT USER OTHER THAN USER FROM ACTIVE CHAT WINDOW THEN MARK SOCKETMESSAGE AS DELIVERED
    useEffect(() => {
        if (socketMessage && selectedFriendData) {
            if (socketMessage.senderId !== selectedFriendData._id && socketMessage.receiverId === myInfo.id) {
                toast.success(`${socketMessage.senderName} sent a new message`)

                dispatch(deliverMessage(socketMessage._id || ''))

                socket.emit('deliverMessage', { ...socketMessage, status: 'delivered' })

                setSocketMessage({})
            }
        }
    }, [socketMessage])

    useEffect(() => {
        dispatch({
            type: 'SOCKET_GET_SUCCESS_CLEAR',
        })
    }, [socketGetSuccess])

    return (
        <>
            <div className={`flex flex-row justify-start items-center h-screen ${className}`}>

                {/* BACKGROUND IMAGE */}
                <Image src={imgBg} className="fixed h-screen min-w-[100%] bg-bgMain left-0 z-1 object-cover" alt="bg" />

                {/* MAIN WINDOW */}
                <motion.div
                    className="messageWindow w-full h-screen flex flex-col items-center"
                    initial={false}
                    animate={isContactInfoOpen ? "open" : "closed"}
                    variants={variantsMessagesWindow}
                    transition={{
                        opacity: { ease: 'linear' },
                        layout: { duration: 0.6 }
                    }}
                >
                    {/* TOP BAR */}
                    <div className="topbar z-20 w-full min-h-[70px] flex flex-row justify-between items-center px-6 
                                    bg-gradient-to-r from-gradientOne via-gradientTwo to-gradientThree border-b-2 border-bgPrimary">

                        <div className={`flex-row justify-center items-center px-2 gap-2 ${Object.keys(selectedFriendData).length === 0 ? 'hidden' : 'flex'}`}>

                            {/* USER AVATAR + ACTIVE STATUS */}
                            <div className="flex flex-row justify-center items-end -space-x-3.5">
                                {
                                    selectedFriendData.profileImage ?
                                        <img
                                            src={`/userProfileImages/${selectedFriendData.profileImage}`}
                                            alt="profilePicturePlaceholder"
                                            className="rounded-full object-cover min-w-[50px] min-h-[50px] max-w-[50px] max-h-[50px]"
                                        />
                                        :
                                        <Image
                                            src={profilePicturePlaceholder}
                                            alt='profilePicturePlaceholder'
                                            width={50}
                                            height={50}
                                            className="rounded-full"
                                            priority
                                        />
                                }

                                {
                                    activeUsers && activeUsers.find((user: SocketUser) => user.userId === selectedFriendData._id) ?
                                        <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-gradientOne"></div> : ''
                                }
                            </div>

                            {/* USERNAME */}
                            <h2 className="text-2xl text-black">
                                {selectedFriendData?.username ? selectedFriendData.username : 'Contact Username'}
                            </h2>

                        </div>

                        {/* OPEN CONTACT INFO BUTTON */}
                        <motion.button
                            whileTap={{ backgroundColor: 'rgba(0, 0, 0, 0.32)' }}
                            className={`${Object.keys(selectedFriendData).length === 0 ? 'hidden' : 'flex'} rounded-full w-[45px] h-[45px] flex justify-center items-center`}
                            onClick={() => [setContactInfoOpen(true), handleGetSharedMedia()]}
                            disabled={isContactInfoOpen ? true : false}
                        >
                            <Image src={dots} alt='dotsIcon' width={25} height={25} className="rounded-full" priority />
                        </motion.button>
                    </div>

                    {/* CHAT WINDOW */}
                    <div
                        id="chatWindow"
                        className={`chatWindow w-full h-full flex flex-col top-0 overflow-y-scroll no-scrollbar pt-2 bg-bgMain ${isMediaSelected || isGalleryImageSelected || isSharedMediaGalleryOpen ? 'hidden' : 'flex'}`}>
                        {
                            messages && messages.map((e: Message, index) => {
                                    return (
                                        e.message && e.senderId === selectedFriendData._id ? 
                                        
                                        <LeftChatBubble
                                            key={index}
                                            message={e.message.text}
                                            deliverTime={moment(e.createdAt).format('kk:mm')}
                                            imageUrl={e.message.image}
                                            handleImageGalleryClick={handleImageGalleryClick}
                                            userProfileImage={selectedFriendData.profileImage}
                                            displayProfileImage={index === 0 || (index > 0 && messages[index - 1].senderId === myInfo.id) ? true : false}
                                        />
                                        :
                                        <RightChatBubble
                                            key={index}
                                            message={e.message.text}
                                            deliverTime={moment(e.createdAt).format('kk:mm')}
                                            status={e.status}
                                            imageUrl={e.message.image}
                                            handleImageGalleryClick={handleImageGalleryClick}
                                        />
                                    )
                            })
                        }
                    </div>

                    {/* TYPING NOTICE */}
                    {
                        typingMessage && typingMessage.message && typingMessage.senderId == selectedFriendData._id ?
                            <p className={`mb-2 w-full text-semibold pl-6 text-lg text-left z-20 ${isMediaSelected || isGalleryImageSelected || isSharedMediaGalleryOpen ? 'hidden' : 'flex'}`}>Typing Message...</p> : ''
                    }

                    {/* MESSAGE TEXTAREA */}
                    <div className={`writeMessage w-full min-h-[100px] z-20 ${Object.keys(selectedFriendData).length === 0 || isMediaSelected || isGalleryImageSelected || isSharedMediaGalleryOpen ? 'hidden' : 'flex'}`}>
                        <div className="flex w-full h-full flex-row justify-center items-center border-t-2 border-bgPrimary mx-4">

                            <div className="w-[95%] rounded-xl h-[75%] flex flex-row justify-between items-center">
                                <div className="w-full h-full flex flex-row mx-4 rounded-lg border justify-center items-center gap-2 bg-bgPrimary border-gray-600 focus-within:ring-2 focus-within:ring-white">

                                    <button onClick={() => handleSelectMediaCliked()}>
                                        <input
                                            onChange={handleMediaSelected}
                                            multiple={true}
                                            type="file"
                                            id="inputFile"
                                            ref={inputFile}
                                            style={{ display: "none" }} />
                                        <GoPaperclip className="h-[30px] w-[30px] text-neutral-400 ml-2" />
                                    </button>
                                    <button>
                                        <PiSmileyLight className="h-[35px] w-[35px] text-neutral-400" />
                                    </button>

                                    <textarea
                                        onKeyDown={keyPressed}
                                        rows={3}
                                        className="w-full h-full mr-2 pt-6 flex items-center justify-start align-middle resize-none text-md rounded-lg ml-2 bg-bgPrimary placeholder-gray-400 text-white no-scrollbar outline-none"
                                        placeholder="Your message..."
                                        onChange={handleTextAreaInputChange}
                                        value={newMessage}
                                    />
                                </div>

                                <button
                                    className="relative"
                                    onClick={() => [handleSendMessage(), setNewMessage("")]}
                                >
                                    <div className="w-[50px] h-[50px] flex justify-center items-center rounded-full rotate-45 bg-gradient-to-r from-gradientOne via-gradientTwo to-gradientThree  border-bgPrimary">
                                        <RiSendPlaneFill className="w-[45px] h-[45px] mr-[6px] mt-[6px] text-bgPrimary" />
                                    </div>
                                    <motion.div
                                        whileTap={{ backgroundColor: 'rgba(0, 0, 0, 0.32)' }}
                                        className="w-[50px] h-[50px] absolute top-0 rounded-full">
                                    </motion.div>
                                </button>

                            </div>

                        </div>
                    </div>

                    {/* GALLERY UPLOAD VIEW */}
                    <div className={`${isMediaSelected ? 'flex' : 'hidden'} z-20 w-full h-full bg-bgMain`}>

                        <div className="flex flex-col justify-between items-center w-full h-full">
                            <button
                                className="mt-4 ml-auto mr-9"
                                onClick={() => [dispatch({ type: "UPLOAD_IMAGES_SUCCESS_CLEAR" }), setNewMessage("")]}>
                                <Image
                                    src={close}
                                    alt='closeIcon'
                                    width={20}
                                    height={20}
                                    priority />
                            </button>
                            <div className="w-[80%] min-h-[550px] max-h-[550px] flex items-center justify-center">
                                <img
                                    src={`/userImages/${imagePaths[imageIndex]}`}
                                    alt="messageImage"
                                    className="object-contain h-full rounded-md" />
                            </div>
                            <textarea
                                onKeyDown={keyPressed}
                                rows={3}
                                className="mx-4 p-2.5 w-[70%] h-[7%] resize-none text-md text-gray-900 rounded-lg border
                                           border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-bgPrimary dark:border-gray-600
                                           dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 no-scrollbar"
                                placeholder="Your message..."
                                onChange={handleTextAreaInputChange}
                                value={newMessage}
                            >
                            </textarea>

                            <div className="flex flex-row w-[80%] justify-between gap-4 items-start h-[100px] border-t-2 border-bgPrimary">
                                <div className="grid grid-rows-1 grid-flow-col w-auto h-auto gap-5 mt-4 mb-6 overflow-x-auto no-scrollbar">

                                    {imagePaths.map((image: string, index) => {
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => setImageIndex(Number(index))}
                                                className={`w-[60px] h-[60px] flex items-center justify-center rounded-lg ${imageIndex === Number(index) ? 'border-2 border-green-500' : 'border border-black'} `}
                                            >
                                                <img
                                                    src={`/userImages/${image}`}
                                                    key={index} alt="messageImage"
                                                    className="object-cover w-full h-full rounded-lg" />
                                            </button>
                                        )
                                    })}

                                    <button
                                        className="w-[60px] h-[60px] flex justify-center items-center border-2 border-brPrimary rounded-lg"
                                        onClick={() => handleSelectMediaCliked()}
                                    >
                                        <input
                                            onChange={handleMediaSelected}
                                            multiple={true}
                                            type="file"
                                            id="inputFile"
                                            ref={inputFile}
                                            style={{ display: "none" }}
                                            accept="image/png, image/gif, image/jpeg" />
                                        <Image
                                            src={plus}
                                            alt='plusIcon'
                                            width={25}
                                            height={25}
                                            priority />
                                    </button>
                                </div>
                                
                                <button
                                    className="mt-5 mr-4"
                                    onClick={() => [handleSendMessage(), setNewMessage(""), setMediaSelected(false), dispatch({ type: "UPLOAD_IMAGES_SUCCESS_CLEAR" })]}>
                                    <div className="w-[50px] h-[50px] flex justify-center items-center rounded-full rotate-45 bg-gradient-to-r from-gradientOne via-gradientTwo to-gradientThree border-bgPrimary">
                                        <RiSendPlaneFill className="w-[45px] h-[45px] mr-[6px] mt-[6px] text-bgPrimary" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <GalleryView imagePaths={galleryImages} handleGalleryClose={handleGalleryClose} index={galleryIndex} mediaSelected={isGalleryImageSelected} />
                    <GalleryView imagePaths={sharedMedia} handleGalleryClose={handleGalleryClose} index={sharedMediaGalleryIndex} mediaSelected={isSharedMediaGalleryOpen} />
                </motion.div>

                {/* CONTACT INFO */}
                <motion.div
                    className="contactInfo z-20 h-full border-l-2 border-bgPrimary"
                    initial={false}
                    animate={isContactInfoOpen ? "open" : "closed"}
                    variants={variantsContactInfo}
                    transition={{
                        opacity: { ease: 'linear' },
                        layout: { duration: 0.3 }
                    }}
                >
                    <div className="w-full h-full flex flex-col justify-start items-center overflow-hidden">
                        {/* TOP BAR */}
                        <div
                            className="topbar w-full min-h-[70px] flex flex-row justify-start items-center px-6 gap-4 border-b-2 border-bgPrimary bg-gradient-to-l from-gradientOne via-gradientTwo to-gradientThree">
                            <motion.button
                                whileTap={{ backgroundColor: 'rgba(0, 0, 0, 0.32)' }}
                                className="rounded-full w-[45px] h-[45px] flex justify-center items-center"
                                onClick={() => setContactInfoOpen(false)}
                            >
                                <Image
                                    src={close}
                                    alt='closeIcon'
                                    width={20}
                                    height={20}
                                    className="rounded-full"
                                    priority />
                            </motion.button>
                        </div>

                        {/* AVATAR NAME AND SHARED MEDIA */}
                        <div className={`w-full bg-bgMain min-h-[93%] `}>
                            
                            <div className={`flex flex-col items-center justify-start w-[100%] h-[100%] gap-4 ${isContactInfoOpen ? 'flex' : 'hidden'}`}>
                                <div className={`flex flex-row justify-center items-end mt-10 group relative mr-2`}>
                                    {
                                        selectedFriendData.profileImage ?
                                            <img
                                                src={`/userProfileImages/${selectedFriendData.profileImage}`}
                                                alt="profilePicturePlaceholder"
                                                className="object-cover rounded-full min-h-[200px] min-w-[200px] max-h-[200px] max-w-[200px]"
                                            />
                                            :
                                            <Image
                                                src={profilePicturePlaceholder}
                                                alt='profilePicturePlaceholder'
                                                width={120}
                                                height={120}
                                                className="rounded-full"
                                                priority
                                            />
                                    }
                                    {
                                        activeUsers && activeUsers.find((user: SocketUser) => user.userId === selectedFriendData._id) ?
                                            <div className={`w-[25px] h-[25px] absolute right-10 bg-green-500 rounded-full border-[3px] border-bgMain `}></div> : ''
                                    }
                                </div>

                                <p className="text-2xl font-semibold text-white text-center">
                                    {selectedFriendData?.username ? selectedFriendData.username : 'Contact Username'}
                                </p>

                                <p className="mb-4 text-lg">
                                    {selectedFriendData?.status ? selectedFriendData.status : ''}
                                </p>

                                <div className={`flex flex-col w-[90%] mb-6 ${isSharedMediaOpen ? 'overflow-y-scroll no-scrollbar' : ''}`}>
                                    <div className="flex flex-row justify-between items-center w-[100%]">
                                        <p className="text-xl self-start ml-1">
                                            Shared Media
                                        </p>
                                        <button onClick={() => handleSharedMediaClicked()}>
                                            <div className="flex flex-row justify-center items-center text-xl">
                                                <p>{sharedMedia.length}</p>
                                                {
                                                    isSharedMediaOpen ? 
                                                        <IoMdArrowDropdown className="w-[30px] h-[30px]" />
                                                        :
                                                        <IoMdArrowDropright className="w-[30px] h-[30px]" />
                                                }
                                            </div>
                                        </button>
                                    </div>

                                    <div className={`flex flex-col w-[100%] h-auto justify-center items-center ${isSharedMediaOpen ? '-space-y-[0px]' : '-space-y-[155px]'}`}>
                                        <div className={` ${isSharedMediaOpen? 'hidden' : 'relative'} w-[100%] h-[160px] bg-gradient-to-t from-bgPrimary to-transparent rounded-lg`}/>
                                        <div className="w-[100%] grid grid-cols-3 gap-2 mb-4">
                                            {[...Array(sharedMediaLength)].map((item, index) =>
                                                <button
                                                    key={index}
                                                    onClick={() => handleSharedMediaImageClicked(index)}
                                                    className="w-[160px] h-[150px] rounded-md flex items-center justify-center  desktop:w-[130px]" >
                                                        {
                                                            sharedMedia[index] ?
                                                                <img src={`/userImages/${sharedMedia[index]}`} key={index} alt="sharedMedia" className="object-cover w-[150px] h-[140px] rounded-md"/>
                                                                :
                                                                <Image src={profilePicturePlaceholder} key={index} width={140} height={140} className="rounded-md" alt="alt" />
                                                        }
                                                    </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    )
}

export default MessagesWinow;