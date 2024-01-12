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
    const { messages, messageSendSuccess } = useAppSelector(state => state.messenger)
    const [newMessage, setNewMessage] = useState('')
    const [isContactInfoOpen, setContactInfoOpen] = useState(false)

    const scrollRefLeft = useRef<HTMLDivElement | null>(null);
    const scrollRefRight = useRef<HTMLDivElement | null>(null);
    const inputFile = useRef<HTMLInputElement | null>(null);

    const dispatch = useAppDispatch()

    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        const socket = io('ws://localhost:8000')
        socketRef.current = socket
    }, [])

    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
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
                    <div className="topbar w-full min-h-[9%] flex flex-row justify-between items-center px-6 bg-slate-300">
                        <div className="flex flex-row gap-2 justify-center items-center">
                            <div className="mt-2">
                                <div className="flex flex-row justify-between items-center px-2 gap-2">
                                    <Image src={profilePicturePlaceholder} alt='profilePicturePlaceholder' width={50} height={50} className="rounded-full"
                                        priority
                                        sizes="(max-width: 768px) 100vw,
                                           (max-width: 1200px) 50vw,
                                           50vw"
                                    />
                                    <h2 className="font-semibold text-xl w-full text-center text-black">
                                        {selectedFriendData?.username ? selectedFriendData.username : 'Contact Username'}
                                    </h2>
                                </div>
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
                    <div className="chatWindow h-[82%] w-full flex flex-col overflow-y-scroll no-scrollbar">
                        {
                            messages?.map((e: { senderId: any; message: { text: string; image:string[] }; }, index: React.Key | null | undefined) => {
                                if (e.senderId === selectedFriendData._id) {
                                    return (
                                        <LeftChatBubble
                                            scrollRef={scrollRefLeft}
                                            key={index}
                                            message={e.message.text}
                                            deliverTime="17:40"
                                            sent={true}
                                            seen={false}
                                            imageUrl={e.message.image}
                                        />
                                    )
                                } else {
                                    return (
                                        <RightChatBubble
                                            scrollRef={scrollRefRight}
                                            key={index}
                                            message={e.message.text}
                                            deliverTime="17:40"
                                            sent={true}
                                            seen={false}
                                            imageUrl={e.message.image}
                                        />
                                    )
                                }
                            })
                        }
                        {

                            typying && typying.message && typying.senderId == selectedFriendData._id ?
                                <p className="ml-14 mb-2 left-0 text-lg">Typing Message...</p> : ''
                        }
                        
                    </div>
                    <div className="writeMessage w-full min-h-[5%] flex flex-row justify-between items-center gap-4 px-4 my-4">
                        <button onClick={() => selectInputMedia()}>
                            <input onChange={mediaSelected} multiple={true} type="file" id="inputFile" ref={inputFile} style={{ display: "none" }} />
                            <Image src={attachFileIcon} alt='attachFileIcon' width={30} height={30} className="ml-4"
                                priority
                                sizes="(max-width: 768px) 100vw,
                                           (max-width: 1200px) 50vw,
                                           50vw"
                            />
                        </button>

                        <div className="w-[88%] rounded-full bg-stone-400 h-[94%] flex flex-row justify-between items-center">
                            <input className="w-full mx-4 bg-transparent"
                                onChange={inputHandler}
                                value={newMessage}
                            >
                            </input>
                            <Image src={emojiIcon} alt='emojiIcon' width={30} height={30} className="mr-4"
                                priority
                                sizes="(max-width: 768px) 100vw,
                                           (max-width: 1200px) 50vw,
                                           50vw"
                            />
                        </div>
                        <button
                            onClick={() => [sendMessage(), setNewMessage("")]}
                        >
                            <Image src={sendIcon} alt='sendIcon' width={30} height={30} className="mr-4"
                                priority
                                sizes="(max-width: 768px) 100vw,
                                           (max-width: 1200px) 50vw,
                                           50vw"
                            />
                        </button>


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