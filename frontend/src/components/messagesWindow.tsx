import React, { ChangeEvent, FC, LegacyRef, RefObject, use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import profilePicturePlaceholder from '@/profilePicturePlaceholder.png'
import sendIcon from '@/send.png'
import emojiIcon from '@/happiness.png'
import dots from '@/dots.png'
import close from '@/close.png'
import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getMessages, messageSend, uploadImages } from "@/store/actions/messengerAction";
import LeftChatBubble from "./leftChatBubble";
import RightChatBubble from "./rightChatBubble";
import { Socket, io } from 'socket.io-client'
import moment from 'moment'
import img from '@/img.png'
import imgBg from '@/bg.png'
import plus from '@/plus.png'

interface Dictionary<T> {
    [Key: string]: T;
}

interface SocketTypyingMessage {
    senderId: string,
    receiverId: string,
    message: string
}

interface Message {
    senderId: string,
    message: {
        text: string,
        image: string[]
    },
    createdAt: string,
    status: string
}


interface MessagesWindowProps {
    className?: string,
    currentUserInfo?: Dictionary<string>
    activeUsers?: Dictionary<string>[]
    typying?: any
}



const MessagesWinow: FC<MessagesWindowProps> = ({ className, currentUserInfo, activeUsers, typying }) => {

    const variantsMessagesWindow = {
        open: { width: '60%' },
        closed: { width: '100%' },
    }

    const variantsContactInfo = {
        open: { width: ['0%', '40%'] },
        closed: { width: ['40%', '0%'] },
    }

    const { selectedFriendData } = useAppSelector(state => state.selectedFriend)
    const { messages, messageSendSuccess, friends, imagePaths } = useAppSelector(state => state.messenger)

    const [newMessage, setNewMessage] = useState('')
    const [isContactInfoOpen, setContactInfoOpen] = useState(false)
    const [isMediaSelected, setMediaSelected] = useState(false)
    const [formData, setFormData] = useState({})
    const [imageIndex, setImageIndex] = useState(0)

    const scrollRefLeft = useRef<HTMLDivElement | null>(null);
    const scrollRefRight = useRef<HTMLDivElement | null>(null);
    const inputFile = useRef<HTMLInputElement | null>(null);

    const dispatch = useAppDispatch()
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        const socket = io("ws://localhost:8000", {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });
        socketRef.current = socket
    }, [])

    useEffect(() => {
        if (messageSendSuccess) {
            if (socketRef.current && currentUserInfo) {
                socketRef.current.emit('sendMessage', messages[messages.length - 1])
                dispatch({
                    type: 'UPDATE_FRIEND_MESSAGE',
                    payload: {
                        messageInfo: messages[messages.length - 1]
                    }
                })
                dispatch({
                    type: 'MESSAGE_SEND_SUCCESS_CLEAR',
                })
            }
        }
    }, [messageSendSuccess])

    useEffect(() => {
        scrollRefLeft.current?.scrollIntoView({ behavior: 'smooth' });
        scrollRefRight.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    useEffect(() => {
        if (imagePaths.length > 0) {
            setMediaSelected(true)
        } else {
            setMediaSelected(false)
        }
    }, [imagePaths])


    const inputHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value)
        if (socketRef.current && currentUserInfo) {
            socketRef.current.emit('typingMessage', {
                senderId: currentUserInfo.id,
                receiverId: selectedFriendData._id,
                message: e.target.value
            })
        }
    }

    const sendMessage = () => {
        newMessage.trim()
        if (newMessage !== "" || imagePaths.length > 0) {
            const data = {
                senderName: currentUserInfo?.username,
                senderId: currentUserInfo?.id,
                receiverId: selectedFriendData._id,
                message: newMessage,
                images: imagePaths
            }

            if (socketRef.current && currentUserInfo) {
                socketRef.current.emit('typingMessage', {
                    senderId: currentUserInfo.id,
                    receiverId: selectedFriendData._id,
                    message: ''
                })
            }

            dispatch(messageSend(data))
        }
    }

    const selectInputMedia = () => {
        //setMediaSelected(true)
        if (inputFile.current) {
            inputFile.current.click()
        }
    }

    const mediaSelected = (e: ChangeEvent<HTMLInputElement>) => {
        
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

    return (
        <>
            <div className={`flex flex-row justify-start items-center h-screen ${className}`}>

                {/* BACKGROUND IMAGE */}
                <Image src={imgBg} className="fixed h-screen min-w-[100%] left-0 z-1 object-cover" alt="bg" />

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
                    <div className="topbar z-20 w-full min-h-[65px] flex flex-row justify-between items-center px-6 
                                    bg-gradient-to-r from-orange via-magneta to-crayola border-b-2 border-darkBgPrimary">

                        <div className={`flex-row justify-center items-center px-2 gap-2 ${Object.keys(selectedFriendData).length === 0 ? 'hidden' : 'flex'}`}>
                           
                            {/* USER AVATAR + ACTIVE STATUS */}
                            <div className="flex flex-row justify-center items-end -space-x-3.5">
                                <Image src={profilePicturePlaceholder} alt='profilePicturePlaceholder' width={50} height={50} className="rounded-full" priority/>
                                {
                                    activeUsers && activeUsers.find((user: any) => user.userId === selectedFriendData._id) ?
                                        <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-orange"></div> : ''
                                }
                            </div>

                            {/* USERNAME */}
                            <h2 className="font-bold text-xl text-black">
                                {selectedFriendData?.username ? selectedFriendData.username : 'Contact Username'}
                            </h2>

                        </div>

                        {/* OPEN CONTACT INFO BUTTON */}
                        <button
                            className={`${Object.keys(selectedFriendData).length === 0 ? 'hidden' : 'flex'}`}
                            onClick={() => setContactInfoOpen(true)}
                            disabled={Object.keys(selectedFriendData).length !== 0 ? false : true}
                        >
                            <Image src={dots} alt='dotsIcon' width={25} height={25} className="rounded-full" priority/>
                        </button>

                    </div>

                    {/* CHAT WINDOW */}
                    <div className={`chatWindow w-full h-full flex flex-col top-0 overflow-y-scroll no-scrollbar bg-darkBgMain ${isMediaSelected ? 'hidden' : 'flex'}`}>
                        {
                            messages?.map((e: Message, index: React.Key | null | undefined) => {
                                if (e.senderId === selectedFriendData._id) {
                                    return (
                                        e.message &&
                                            <LeftChatBubble
                                                scrollRef={scrollRefLeft}
                                                key={index}
                                                message={e.message.text}
                                                deliverTime={moment(e.createdAt).format('kk:mm')}
                                                status={e.status}
                                                imageUrl={e.message.image}
                                            />
                                    )
                                } else {
                                    return (
                                        <>
                                            <RightChatBubble
                                                scrollRef={scrollRefRight}
                                                key={index}
                                                message={e.message.text}
                                                deliverTime={moment(e.createdAt).format('kk:mm')}
                                                status={e.status}
                                                imageUrl={e.message.image}
                                            />
                                        </>

                                    )
                                }
                            })
                        }
                    </div>

                    {/* TYPING NOTICE */}
                    {
                        typying && typying.message && typying.senderId == selectedFriendData._id ?
                            <p className={`mb-2 w-full text-semibold pl-6 text-lg text-left z-20 ${isMediaSelected ? 'hidden' : 'flex'}`}>Typing Message...</p> : ''
                    }

                    {/* MESSAGE TEXTAREA */}
                    <div className={`writeMessage w-full min-h-[100px] z-20 ${Object.keys(selectedFriendData).length === 0 || isMediaSelected ? 'hidden' : 'flex'}`}>
                        <div className="flex w-full h-full flex-row justify-center items-center border-t-2 border-darkBgPrimary mx-4">
                            <button onClick={() => selectInputMedia()}>
                                <input onChange={mediaSelected} multiple={true} type="file" id="inputFile" ref={inputFile} style={{ display: "none" }} />
                                <Image src={img} alt='attachFileIcon' width={45} height={30} className="mr-4"
                                    priority
                                    sizes="(max-width: 768px) 100vw,
                                           (max-width: 1200px) 50vw,
                                           50vw"
                                />
                            </button>

                            <button>
                                <Image src={emojiIcon} alt='emojiIcon' width={40} height={30} className="mr-2"
                                    priority
                                    sizes="(max-width: 768px) 100vw,
                                           (max-width: 1200px) 50vw,
                                           50vw"
                                />
                            </button>

                            <div className="w-[88%] rounded-xl h-[60%] flex flex-row justify-between items-center">
                                <textarea id="chat" rows={3} className="mx-4 p-2.5 w-full h-full resize-none text-md text-gray-900 rounded-lg border
                                 border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-darkBgPrimary dark:border-gray-600
                                  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 no-scrollbar"
                                    placeholder="Your message..."
                                    onChange={inputHandler}
                                    value={newMessage}
                                >

                                </textarea>

                                <button
                                    onClick={() => [sendMessage(), setNewMessage("")]}
                                >
                                    
                                    <Image src={sendIcon} alt='sendIcon' width={35} height={35} className="mr-4"
                                        priority
                                        sizes="(max-width: 768px) 100vw,
                                           (max-width: 1200px) 50vw,
                                           50vw"
                                    />
                                </button>

                            </div>

                        </div>
                    </div>

                    <div className={`${isMediaSelected ? 'flex' : 'hidden'} z-20 w-full h-full bg-darkBgMain overflow-y-scroll no-scrollbar`}>

                        <div className="flex flex-col justify-between items-center w-full min-h-[800px] gap-10">
                            <button
                                className="mt-4 mr-auto ml-4"
                                onClick={() => [dispatch({ type: "UPLOAD_IMAGES_SUCCESS_CLEAR" }), setNewMessage("")]}>
                                <Image src={close} alt='profilePicturePlaceholder' width={20} height={20} priority />
                            </button>
                            <div className="w-[480px] h-[480px] flex items-center justify-center">
                                <img src={`/userImages/${imagePaths[imageIndex]}`} alt="messageImage" className="object-contain w-full h-full" />
                            </div>
                            <textarea id="chatImage" rows={3} className="mx-4 p-2.5 w-[60%] h-[7%] resize-none text-md text-gray-900 rounded-lg border
                                 border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-darkBgPrimary dark:border-gray-600
                                  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 no-scrollbar"
                                placeholder="Your message..."
                                onChange={inputHandler}
                                value={newMessage}
                            >
                            </textarea>

                            <div className="flex flex-row w-[90%] justify-between items-start h-[120px] border-t-2 border-darkBgPrimary ">
                                <div className="flex flex-row w-full justify-center items-center h-auto gap-5 mt-4  overflow-y-scroll no-scrollbar">

                                    {imagePaths.map((image: string, index: React.Key | null | undefined) => {
                                        return (
                                            <button onClick={() => setImageIndex(Number(index))} className={`w-[60px] h-[60px] flex items-center justify-center rounded-lg ${imageIndex === Number(index) ? 'border-2 border-green-500' : 'border border-black'} `} id={String(index)}>
                                                <img src={`/userImages/${image}`} alt="messageImage" className="object-cover w-full h-full rounded-lg" />
                                            </button>
                                        )

                                    })}
                                    
                                    <button
                                        className="w-[60px] h-[60px] flex justify-center items-center border-2 border-black rounded-lg"
                                        onClick={() => selectInputMedia()}
                                    >
                                        <input onChange={mediaSelected} multiple={true} type="file" id="inputFile" ref={inputFile} style={{ display: "none" }} />
                                        <Image src={plus} alt='profilePicturePlaceholder' width={25} height={25} priority />
                                    </button>
                                    
                                </div>
                                <div className="mt-4 mr-2">
                                    <button
                                        className=""
                                        onClick={() => [sendMessage(), setNewMessage(""), setMediaSelected(false), dispatch({ type: "UPLOAD_IMAGES_SUCCESS_CLEAR" })]}>
                                        <Image src={sendIcon} alt='profilePicturePlaceholder' width={50} height={50} priority />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </motion.div>



                {/* CONTACT INFO */}
                <motion.div
                    className="contactInfo z-20 h-full border-l-2 border-darkBgPrimary"
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
                        <div className="topbar w-full min-h-[65px] flex flex-row justify-start items-center px-6 gap-4 border-b-2 border-darkBgPrimary bg-gradient-to-l from-orange via-magneta to-crayola">
                            <Image src={close} alt='closeIcon' width={20} height={20} className="rounded-full"
                                priority
                                sizes="(max-width: 768px) 100vw,
                                                    (max-width: 1200px) 50vw,
                                                    50vw"
                                onClick={() => setContactInfoOpen(false)}
                            />

                        </div>

                        {/* AVATAR NAME AND SHARED MEDIA */}
                        <div className="w-full bg-darkBgMain min-h-[93%] flex flex-col justify-start items-center gap-4">
                            <div className="flex flex-row justify-center items-end -space-x-5 mt-10">
                                <Image src={profilePicturePlaceholder} alt='profilePicturePlaceholder' width={90} height={90} className="rounded-full"
                                    priority
                                    sizes="(max-width: 768px) 100vw,
                                            (max-width: 1200px) 50vw,
                                            50vw"
                                />
                                {
                                    activeUsers && activeUsers.find((user: any) => user.userId === selectedFriendData._id) ?
                                        <div className="w-[18px] h-[18px] bg-green-500 rounded-full border-[2.5px] border-darkBgMain"></div> : ''
                                }
                            </div>
                            <p className="text-2xl font-semibold text-white text-center">
                                {selectedFriendData?.username ? selectedFriendData.username : 'Contact Username'}
                            </p>

                        </div>
                    </div>

                </motion.div>
            </div>
        </>
    )
}

export default MessagesWinow;