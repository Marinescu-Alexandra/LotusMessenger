import Head from "next/head"
import React, { useEffect, useRef, useState } from "react"
import DirectMessages from "@/components/directMessages"
import MessagesWinow from "@/components/messagesWindow"
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { seenMessage, updateMessage, getFriends, deliverUnsentMessages, getMessages } from "@/store/actions/messengerAction"
import { updateSharedMedia } from '@/store/actions/selectedFriendAction'
import { Socket, io } from 'socket.io-client'
import { useRouter } from 'next/router'
import { userLogout } from "@/store/actions/authAction";
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
        image: string[]
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

interface UserInfo {
    id: string,
    username: string,
    registerTimer: string,
    profileImage: string,
    status: string,
    theme: string,
    iat: number,
    exp: number
}

interface SocketUser {
    userId: string,
    socketId: string,
    userInfo: UserInfo
}

export default function Home() {

    const { friends, messages, newUserAdded, undeliveredMessages } = useAppSelector(state => state.messenger)
    const { authenticate, myInfo } = useAppSelector(state => state.auth);
    const { selectedFriendData } = useAppSelector(state => state.selectedFriend)

    const currentUserInfo: Dictionary<string> = myInfo

    const [activeUsers, setActiveUsers] = useState<Array<SocketUser>>([])

    const socketRef = useRef<Socket | null>(null)
    const [socketMessage, setSocketMessage] = useState<Partial<SocketMessage>>({})
    const [typingMessage, setTypingMessage] = useState<Partial<SocketTypyingMessage>>({})

    const [isClient, setIsClient] = useState(false)

    const dispatch = useAppDispatch()
    const router = useRouter()

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

        socket.on('updateFriendList', (userId: string) => {
            dispatch(getFriends())
        })

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

        socketRef.current.on('getUser', (users: SocketUser[]) => {
            const filteredUsers = users.filter((user: SocketUser) => user.userId !== currentUserInfo.id)
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
        if (selectedFriendData && Object.keys(selectedFriendData).length > 0) {
            dispatch(getMessages(selectedFriendData._id))
        }
    }, [selectedFriendData])

    // GET ALL UNDELIVERED MESSAGES
    useEffect(() => {
        if (friends) {
            friends.forEach((friend: any) => {
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

                if (socketMessage.message?.image) {
                    socketMessage.message?.image.forEach((image: string) => dispatch(updateSharedMedia(image)));
                }

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
        if (messages.length >= 1 && messages[messages.length - 1].status === "delivered" && messages[messages.length - 1].receiverId === currentUserInfo.id) {

            for (let i = messages.length - 1; i >= 0; i--) {
                if ((messages[i].status === 'delivered' || messages[i].status === 'unseen') && messages[i].receiverId === currentUserInfo.id) {
                    dispatch(seenMessage(messages[i]))
                } else if (messages[i].status === 'seen' && messages[i].receiverId === currentUserInfo.id) {
                    break
                }
            }

            if (socketRef.current) {
                socketRef.current.emit('messageSeen', messages[messages.length - 1])
            }
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
                <main className={`w-full min-h-[100px] min-w-[1280px] bg-neutral-800 flex flex-row ${currentUserInfo.theme}`}>
                    <Toaster
                        position={'top-right'}
                        reverseOrder={false}
                        toastOptions={{
                            style: {
                                fontSize: '18px'
                            }
                        }}
                    />
                    <DirectMessages className="w-[28%] min-h-[100%]" myInfo={myInfo} activeUsers={activeUsers} />
                    <MessagesWinow className="w-[72%] min-h-[100%] z-10" currentUserInfo={myInfo} activeUsers={activeUsers} typying={typingMessage} />
                </main>
            </>
        )
    }
}
