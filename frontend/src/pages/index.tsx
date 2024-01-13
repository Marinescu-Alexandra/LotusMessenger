import Head from "next/head"
import React, { useEffect, useRef, useState } from "react"
import DirectMessages from "@/components/directMessages"
import MessagesWinow from "@/components/messagesWindow"
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { seenMessage, updateMessage, getFriends } from "@/store/actions/messengerAction"
import { Socket, io } from 'socket.io-client'
import { useRouter } from 'next/router'

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

type SocketTypyingMessage = {
    senderId: string,
    receiverId: string,
    message: string
}

export default function Home() {
    const { friends, messages } = useAppSelector(state => state.messenger)
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

    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        if (!authenticate) {
            router.push('/login')
        }
    })

    useEffect(() => {
        const socket = io('ws://localhost:8000')
        socketRef.current = socket
        socket.on('getMessage', (data: any) => {
            setSocketMessage(data)
        })

        socket.on('typingMessageGet', (data: any) => {
            setTypingMessage(data)
        })

        socket.on('messageSeenResponse', (data: any) => {
            console.log(data)
            dispatch({
                type: 'SEEN_MESSAGE',
                payload: {
                    messageInfo: data
                }
            })
        })

        socket.on('messageDeliverResponse', (data: any) => {
            console.log(data)
            dispatch({
                type: 'DELIVER_MESSAGE',
                payload: {
                    messageInfo: data
                }
            })
        })
    }, [socketMessage, typingMessage])

    useEffect(() => {
        if (socketMessage && selectedFriendData && socketRef.current) {
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
    }, [socketMessage, selectedFriendData])

    useEffect(() => {
        if (socketRef.current && currentUserInfo) {
            socketRef.current.emit('addUser', currentUserInfo.id, currentUserInfo)
        }
    }, [])

    useEffect(() => {
        if (socketRef.current && currentUserInfo) {
            socketRef.current.on('getUser', (users: any) => {
                const filteredUsers = users.filter((user: any) => user.userId !== currentUserInfo.id)
                setActiveUsers(filteredUsers)
            })
        }
    }, [])

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

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getFriends())
    }, [dispatch]);

    if (authenticate && isClient) {
        return (
            <>
                <Head>
                    <title>Messenger</title>
                    <meta name="login page" content="content" />
                </Head>
                <main className="w-full min-h-screen bg-neutral-800 flex flex-row ">
                    <Toaster
                        position={'top-right'}
                        reverseOrder={false}
                        toastOptions={{
                            style: {
                                fontSize: '18px'
                            }
                        }}
                    />
                    <DirectMessages className="w-[30%] bg-slate-400" myInfo={myInfo} activeUsers={activeUsers} />
                    <MessagesWinow className="w-[70%] bg-slate-500" currentUserInfo={myInfo} activeUsers={activeUsers} typying={typingMessage} />
                </main> 
            </>

        )
    }
}
