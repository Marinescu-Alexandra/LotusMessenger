import React, { ChangeEvent, FC, LegacyRef, RefObject, useEffect, useRef, useState } from "react";
import Image from "next/image";
import profilePicturePlaceholder from '@/profilePicturePlaceholder.png'
import attachFileIcon from '@/attached.png'
import sendIcon from '@/send.png'
import emojiIcon from '@/happiness.png'
import dots from '@/dots.png'
import close from '@/close.png'
import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getMessages, messageSend, imageMessageSend } from "@/store/actions/messengerAction";
import LeftChatBubble from "./leftChatBubble";
import RightChatBubble from "./rightChatBubble";
import { Socket, io } from 'socket.io-client'
import moment from 'moment'
import img from '@/img.png'

interface Dictionary<T> {
    [Key: string]: T;
}

interface SocketTypyingMessage {
    senderId: string,
    receiverId: string,
    message: string
}


interface MessagesWindowProps {
    className?: string,
    currentUserInfo?: Dictionary<string>
    activeUsers?: Dictionary<string>[]
    typying?: any
}



const MessagesWinow: FC<MessagesWindowProps> = ({ className, currentUserInfo, activeUsers, typying }) => {

    const { selectedFriendData } = useAppSelector(state => state.selectedFriend)
    const { messages, messageSendSuccess, friends } = useAppSelector(state => state.messenger)
    const [newMessage, setNewMessage] = useState('')
    const [isContactInfoOpen, setContactInfoOpen] = useState(false)

    const [lasMessageIsSeen, setLastMessageIsSeen] = useState(false)

    useEffect(() => {
        if (selectedFriendData && friends) {
            const currentFriendData = friends.find((friend: any) => friend._id === selectedFriendData._id)
            if (currentUserInfo && currentFriendData && currentFriendData.lastMessageInfo !== null) {
                console.log(currentFriendData.lastMessageInfo.receiverId, currentUserInfo.id)
                if (currentFriendData.lastMessageInfo.senderId === currentUserInfo.id) {
                    if (currentFriendData.lastMessageInfo.status === 'seen') {
                        setLastMessageIsSeen(true)
                    } else {
                        setLastMessageIsSeen(false)
                    }
                }
            }
        }
    }, [friends, selectedFriendData])

    const scrollRefLeft = useRef<HTMLDivElement | null>(null);
    const scrollRefRight = useRef<HTMLDivElement | null>(null);
    const inputFile = useRef<HTMLInputElement | null>(null);

    const dispatch = useAppDispatch()

    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        const socket = io('ws://localhost:8000')
        socketRef.current = socket
    }, [])

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
        if (newMessage !== "") {
            const data = {
                senderName: currentUserInfo?.username,
                senderId: currentUserInfo?.id,
                receiverId: selectedFriendData._id,
                message: newMessage
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
        if (inputFile.current) {
            inputFile.current.click()
        }
    }

    const mediaSelected = (e: ChangeEvent<HTMLInputElement>) => {
        // for real time image send return to lecture 313 min 7:52
        // if (socketRef.current && currentUserInfo) {
        //     socketRef.current.emit('sendMessage', {
        //         senderId: currentUserInfo.id,
        //         senderName: currentUserInfo.username,
        //         receiverId: selectedFriendData._id,
        //         time: new Date(),
        //         message: {
        //             text: newMessage,
        //             image: ''
        //         }
        //     })
        // }
        const formData = new FormData()
        if (e.target.files) {
            let length = e.target.files.length
            if (e.target.files.length > 10) {
                length = 10
            }
            formData.append('senderId', currentUserInfo?.id ? currentUserInfo.id : '');
            formData.append('receiverId', selectedFriendData._id);

            for (let i = 0; i < length; i++) {
                formData.append('fileToUpload[]', e.target.files[i]);
                formData.append('imageName[]', Date.now() + e.target.files[i].name);
            }
            dispatch(imageMessageSend(formData))
        }
    }

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
        if (selectedFriendData) {
            dispatch(getMessages(selectedFriendData._id))
        }
    }, [dispatch, selectedFriendData, selectedFriendData?._id])

    const variantsMessagesWindow = {
        open: { width: '60%' },
        closed: { width: '100%' },
    }

    const variantsContactInfo = {
        open: { width: ['0%', '40%'] },
        closed: { width: ['40%', '0%'] },
    }

    return (
        <>
            <div className={`flex flex-row justify-start items-center ${className}`}>
                <motion.div className="messageWindow w-full h-screen flex flex-col justify-start items-center"
                    initial={false}
                    animate={isContactInfoOpen ? "open" : "closed"}
                    variants={variantsMessagesWindow}
                    transition={{
                        opacity: { ease: 'linear' },
                        layout: { duration: 0.6 }
                    }}
                >
                    <div className="topbar w-full min-h-[9%] flex flex-row justify-between items-center px-6 bg-darkBgMain border-b border-neutral-400">
                        <div className="flex flex-row gap-2 justify-center items-center">

                            <div className="flex flex-row justify-between items-center px-2 gap-3">
                                <Image src={profilePicturePlaceholder} alt='profilePicturePlaceholder' width={50} height={50} className="rounded-full"
                                    priority
                                    sizes="(max-width: 768px) 100vw,
                                           (max-width: 1200px) 50vw,
                                           50vw"
                                />
                                <h2 className="font-semibold text-xl w-full text-center text-white">
                                    {selectedFriendData?.username ? selectedFriendData.username : 'Contact Username'}
                                </h2>

                                {
                                    activeUsers && activeUsers.find((user: any) => user.userId === selectedFriendData._id) ?
                                        <div className="w-3 h-3 bg-green-500 rounded-full relative border-2 bottom-[14px] left-[45px]"></div> : ''
                                }
                            </div>
                        </div>
                        <button
                            onClick={() => setContactInfoOpen(true)}
                            disabled={Object.keys(selectedFriendData).length !== 0 ? false : true}
                        >
                            <Image src={dots} alt='dotsIcon' width={25} height={25} className="rounded-full"
                                priority
                                sizes="(max-width: 768px) 100vw,
                                           (max-width: 1200px) 50vw,
                                           50vw"

                            />
                        </button>

                    </div>
                    <div className="chatWindow h-[81%] w-full flex flex-col overflow-y-scroll no-scrollbar bg-darkBgMain">
                        {
                            messages?.map((e: { senderId: any; message: { text: string; image: string[] }; createdAt: string }, index: React.Key | null | undefined) => {
                                if (e.senderId === selectedFriendData._id) {
                                    return (
                                        e.message ?
                                            <LeftChatBubble
                                                scrollRef={scrollRefLeft}
                                                key={index}
                                                message={e.message.text}
                                                deliverTime={moment(e.createdAt).format('kk:mm')}
                                                sent={true}
                                                seen={false}
                                                imageUrl={e.message.image}
                                            />
                                            :
                                            <></>
                                    )
                                } else {
                                    return (
                                        <>
                                            <RightChatBubble
                                                scrollRef={scrollRefRight}
                                                key={index}
                                                message={e.message.text}
                                                deliverTime={moment(e.createdAt).format('kk:mm')}
                                                sent={true}
                                                seen={lasMessageIsSeen}
                                                imageUrl={e.message.image}
                                            />
                                            <div className="flex flex-col items-end mr-5">
                                                {
                                                    index === messages.length - 1 && lasMessageIsSeen === true ?
                                                        <p>Seen</p> : ''
                                                }

                                            </div>
                                        </>

                                    )
                                }
                            })
                        }
                    </div>
                    {
                        typying && typying.message && typying.senderId == selectedFriendData._id ?
                            <p className="ml-14 mb-2 left-0 text-lg">Typing Message...</p> : ''
                    }
                    <div className="writeMessage w-full min-h-[10%] ">
                        <div className="flex w-full h-full flex-row justify-center items-center border-t border-neutral-400">
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
                                {/* <input className="w-full bg-transparent"
                                    onChange={inputHandler}
                                    value={newMessage}
                                >
                                </input> */}
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

                </motion.div>

                <motion.div className="contactInfo h-screen bg-black"
                    initial={false}
                    animate={isContactInfoOpen ? "open" : "closed"}
                    variants={variantsContactInfo}
                    transition={{
                        opacity: { ease: 'linear' },
                        layout: { duration: 0.3 }
                    }}
                >
                    <div className="w-full h-screen flex flex-col justify-start items-center overflow-hidden">
                        <div className="topbar w-full min-h-[9%] flex flex-row justify-start items-center px-6 bg-slate-400 gap-4">
                            <Image src={close} alt='closeIcon' width={20} height={20} className="rounded-full"
                                priority
                                sizes="(max-width: 768px) 100vw,
                                                    (max-width: 1200px) 50vw,
                                                    50vw"
                                onClick={() => setContactInfoOpen(false)}
                            />

                        </div>
                        <div className="w-full bg-slate-600 min-h-[91%] flex flex-col justify-start items-center">
                            <div>
                                <Image src={profilePicturePlaceholder} alt='profilePicturePlaceholder' width={90} height={90} className="rounded-full mt-10"
                                    priority
                                    sizes="(max-width: 768px) 100vw,
                                           (max-width: 1200px) 50vw,
                                           50vw"
                                />
                                {
                                    activeUsers && activeUsers.find((user: any) => user.userId === selectedFriendData._id) ?
                                        <div className="w-5 h-5 bg-green-500 rounded-full relative bottom-6 left-[65px] border-2"></div> : ''
                                }
                            </div>
                            <p className="text-xl font-semibold text-white text-center">
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