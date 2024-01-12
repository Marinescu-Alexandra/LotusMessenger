import Head from "next/head"
import React, { useEffect, useRef, useState } from "react"
import DirectMessages from "@/components/directMessages"
import MessagesWinow from "@/components/messagesWindow"
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { seenMessage, updateMessage, getFriends } from "@/store/actions/messengerAction"
import { Socket, io } from 'socket.io-client'

import toast, {Toaster} from 'react-hot-toast'

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
    const { myInfo } = useAppSelector(state => state.auth)
    const { selectedFriendData } = useAppSelector(state => state.selectedFriend)

    const currentUserInfo: Dictionary<string> = myInfo

    const [activeUsers, setActiveUsers] = useState([])

    const socketRef = useRef<Socket | null>(null)
    const [socketMessage, setSocketMessage] = useState<Partial<SocketMessage>>({})
    const [typingMessage, setTypingMessage] = useState<Partial<SocketTypyingMessage>>({})

    useEffect(() => {
        const socket = io('ws://localhost:8000')
        socketRef.current = socket
        socket.on('getMessage', (data: any) => {
            console.log(data)
            setSocketMessage(data)
            console.log('socketMessage',socketMessage)
        })

        socket.on('typingMessageGet', (data: any) => {
            setTypingMessage(data)
            const cct = data
            //console.log(typingMessage)
            //console.log(data)
        })
    }, [socketMessage, typingMessage])

    useEffect(() => {
        if (socketMessage && selectedFriendData) {
            //(socketMessage)
            if (socketMessage.senderId === selectedFriendData._id && socketMessage.receiverId === currentUserInfo.id) {
                dispatch({
                    type: 'SOCKET_MESSAGE',
                    payload: {
                        message: socketMessage
                    }
                })
                dispatch(seenMessage(socketMessage))
                dispatch({
                    type: 'UPDATE_FRIEND_MESSAGE',
                    payload: {
                        messageInfo: socketMessage
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
        if (socketMessage && selectedFriendData) {
            if (socketMessage.senderId !== selectedFriendData._id && socketMessage.receiverId === currentUserInfo.id) {
                toast.success(`${socketMessage.senderName} sent a new message`)
            }
        }
    }, [socketMessage])

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getFriends())
    }, [dispatch]);

    return (
        <div>
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
        </div>
    )
}
