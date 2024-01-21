import Head from "next/head"
import React, { useEffect, useRef, useState } from "react"
import DirectMessages from "@/components/directMessages"
import MessagesWinow from "@/components/messagesWindow"
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { seenMessage, updateMessage, getFriends, deliverUnsentMessages, getUnseenMessages, getMessages } from "@/store/actions/messengerAction"
import { Socket, io } from 'socket.io-client'
import { useRouter } from 'next/router'
import { userLogout } from "@/store/actions/authAction";
import imgBg from '@/bg.png'

import toast, { Toaster } from 'react-hot-toast'

interface Dictionary<T> {
    [Key: string]: T;
}

type SocketMessage = {
    senderId: string,
    senderName: string,
    receiverId: string,
    createdAt: string,
    updatedAt: string,
    message: {
        text: string,
        image: string
    }
    __v: number,
    _id: string,
    status: string,
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

type SocketTypyingMessage = {
    senderId: string,
    receiverId: string,
    message: string
}

export default function Home() {
    const { friends, messages, newUserAdded, undeliveredMessages } = useAppSelector(state => state.messenger)
    const { authenticate } = useAppSelector(state => state.auth);
    const router = useRouter()
    const { myInfo } = useAppSelector(state => state.auth)
    const { selectedFriendData } = useAppSelector(state => state.selectedFriend)

    const currentUserInfo: Dictionary<string> = myInfo

    const [activeUsers, setActiveUsers] = useState([])

    const socketRef = useRef<Socket | null>(null)
    const [socketMessage, setSocketMessage] = useState<Partial<SocketMessage>>({})
    const [typingMessage, setTypingMessage] = useState<Partial<SocketTypyingMessage>>({})

    const [isClient, setIsClient] = useState(false)

    const dispatch = useAppDispatch()

    useEffect(() => {
        setIsClient(true)
    }, [])


    useEffect(() => {
        if (!authenticate) {
            router.push('/login')
        }
    })

    useEffect(() => {
        const socket = io("ws://localhost:8000", {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });

        socketRef.current = socket
        socket.on('getMessage', (data: any) => {
            setSocketMessage(data)
        })

        socket.on('typingMessageGet', (data: any) => {
            setTypingMessage(data)
        })

        socket.on('messageSeenResponse', (data: any) => {
            dispatch({
                type: 'SEEN_MESSAGE',
                payload: {
                    messageInfo: data
                }
            })
        })

        socket.on('messageDeliverResponse', (data: any) => {
            console.log('messageDeliverResponse', data)
            dispatch({
                type: 'DELIVER_MESSAGE',
                payload: {
                    messageInfo: data
                }
            })
        })

        socketRef.current.on('removeOtherActiveInstance', (data: any) => {
            dispatch(userLogout());
            if (socketRef.current && currentUserInfo) {
                socketRef.current.emit('removeSocketInstance', currentUserInfo.id)
            }
        })

        socketRef.current.on('getUser', (users: any) => {
            const filteredUsers = users.filter((user: any) => user.userId !== currentUserInfo.id)
            setActiveUsers(filteredUsers)
        })

        socketRef.current.on('newUserAdded', (data: boolean) => {
            dispatch({
                type: 'NEW_USER_ADDED',
                payload: {
                    newUserAdded: data
                }
            })
        })
    }, [socketMessage, typingMessage])

    useEffect(() => {
        setTimeout(() => {
            if (socketRef.current && currentUserInfo) {
                socketRef.current.emit('addUser', currentUserInfo.id, currentUserInfo)
            }
        }, 1000)

    }, [])


    // GET SELECTED FRIEND MESSAGES
    useEffect(() => {
        if (selectedFriendData && friends) {
            dispatch(getMessages(selectedFriendData._id))
        }
    }, [friends, selectedFriendData])

    // GET ALL UNDELIVERED MESSAGES
    useEffect(() => {
        if (friends) {
            friends.forEach((friend:any) => {
                if (friend.lastMessageInfo && friend.lastMessageInfo.status === 'unseen') {
                    dispatch(deliverUnsentMessages(friend._id))
                }
            });
        }
    }, [friends])

    // MARK ALL UNDELIVERED MESSAGES AS DELIVERED
    useEffect(() => {
        if (Object.keys(undeliveredMessages).length > 0) {
            undeliveredMessages.forEach((undeliveredMessage: Message) => {
                dispatch(updateMessage(undeliveredMessage))
            })
            if (socketRef.current) {
                socketRef.current.emit('deliverMessage', undeliveredMessages[undeliveredMessages.length - 1])
                dispatch({
                    type: 'UPDATE_FRIEND_MESSAGE',
                    payload: {
                        messageInfo: undeliveredMessages[undeliveredMessages.length - 1],
                        status: 'delivered'
                    }
                })
            }
            dispatch({
                type: "UNDELIVERED_GET_SUCCESS_CLEAR",
            })
        }
    }, [undeliveredMessages])



    //Update real time message
    useEffect(() => {
        if (socketMessage && Object.keys(selectedFriendData).length > 0 && socketRef.current) {
            if (socketMessage.senderId === selectedFriendData._id && socketMessage.receiverId === currentUserInfo.id) {
                dispatch({
                    type: 'SOCKET_MESSAGE',
                    payload: {
                        message: socketMessage
                    }
                })

                dispatch(seenMessage(socketMessage))

                socketRef.current.emit('messageSeen', socketMessage)

                dispatch({
                    type: 'UPDATE_FRIEND_MESSAGE',
                    payload: {
                        messageInfo: socketMessage,
                        status: 'seen'
                    }
                })
            }
        }
    }, [socketMessage])

    //Update chunk of unseen and delivered messages as seen
    useEffect(() => {
        if (messages.length >= 1 && messages[messages.length - 1].status === "delivered") {
            if (messages[messages.length - 1].receiverId === currentUserInfo.id) {
                for (let i = messages.length - 1; i >= 0; i--) {
                    if ((messages[i].status === 'delivered' || messages[i].status === 'unseen') && messages[i].receiverId === currentUserInfo.id) {
                        dispatch(seenMessage(messages[i]))
                    } else if (messages[i].status === 'seen' && messages[i].receiverId === currentUserInfo.id){
                        break
                    }
                }
            }
            if(socketRef.current)
                socketRef.current.emit('messageSeen', messages[messages.length - 1])

            dispatch({
                type: 'UPDATE_FRIEND_MESSAGE',
                payload: {
                    messageInfo: messages[messages.length - 1],
                    status: 'seen'
                }
            })
        }
    }, [messages])

    //Notify user of new unseen messages when online
    useEffect(() => {
        if (socketMessage && selectedFriendData && socketRef.current) {
            if (socketMessage.senderId !== selectedFriendData._id && socketMessage.receiverId === currentUserInfo.id) {
                toast.success(`${socketMessage.senderName} sent a new message`)

                dispatch(updateMessage(socketMessage))

                socketRef.current.emit('deliverMessage', socketMessage)

                dispatch({
                    type: 'UPDATE_FRIEND_MESSAGE',
                    payload: {
                        messageInfo: socketMessage,
                        status: 'delivered'
                    }
                })
            }
        }
    }, [socketMessage])
    
    useEffect(() => {
        dispatch(getFriends())
        if (newUserAdded === true) {
            dispatch({
                type: 'NEW_USER_ADDED_CLEAR'
            })
        }
    }, [newUserAdded]);

    if (authenticate && isClient) {
        return (
            <>
                <Head>
                    <title>Messenger</title>
                    <meta name="login page" content="content" />
                </Head>
                <main className="w-full min-h-[100px] min-w-[1280px] bg-neutral-800 flex flex-row ">
                    <Toaster
                        position={'top-right'}
                        reverseOrder={false}
                        toastOptions={{
                            style: {
                                fontSize: '18px'
                            }
                        }}
                    />
                    <DirectMessages className="w-[30%] min-h-[100%] bg-darkBgMain" myInfo={myInfo} activeUsers={activeUsers} />
                    <MessagesWinow className="w-[70%] min-h-[100%] bg-darkBgMain" currentUserInfo={myInfo} activeUsers={activeUsers} typying={typingMessage} />
                </main> 
            </>

        )
    }
}
