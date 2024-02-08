import Head from "next/head"
import React, { useEffect, useState } from "react"
import DirectMessages from "@/components/directMessages"
import MessagesWinow from "@/components/messagesWindow"
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getFriends, getLastMessages } from "@/store/actions/messengerAction"
import { userLogout } from "@/store/actions/authAction"
import { useRouter } from 'next/router'
import { Toaster } from 'react-hot-toast'
import { socket } from "@/socket"
import { SocketUser } from "@/ts/interfaces/interfaces"

export default function Home() {

    const { newUserAdded } = useAppSelector(state => state.messenger)
    const { authenticate, myInfo } = useAppSelector(state => state.auth);

    const [activeUsers, setActiveUsers] = useState<Array<SocketUser>>([])

    const [isClient, setIsClient] = useState(false)

    const dispatch = useAppDispatch()
    const router = useRouter()

    // GIVE TIME TO DISSMISS OTHER ACTIVE INSTANCES WHEN USER IS TRYING TO LOGIN MULTIPLE TIMES
    useEffect(() => {
        setTimeout(() => {
            if (myInfo) {
                socket.emit('addUser', myInfo.id, myInfo)
            }
        }, 1000)

        socket.on('removeOtherActiveInstance', (id: string) => {
            dispatch(userLogout());
            if (myInfo) {
                socket.emit('removeSocketInstance', myInfo.id)
            }
        })

        socket.on('newUserAdded', (data: boolean) => {
            dispatch({
                type: 'NEW_USER_ADDED',
                payload: {
                    newUserAdded: data
                }
            })
        })
    }, [myInfo])

    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        if (!authenticate) {
            router.push('/login')
        }
    })
    
    useEffect(() => {
        dispatch(getFriends())
        dispatch(getLastMessages())
    }, []);

    useEffect(() => {
        socket.on('getUser', (users: SocketUser[]) => {
            const filteredUsers = users.filter((user: SocketUser) => user.userId !== myInfo.id)
            setActiveUsers(filteredUsers)
        })
    }, [activeUsers])

    useEffect(() => {
        if (newUserAdded === true) {
            dispatch({
                type: 'NEW_USER_ADDED_CLEAR'
            })
        }
    }, [newUserAdded])

    if (authenticate && isClient) {
        return (
            <>
                <Head>
                    <title>Messenger</title>
                    <meta name="login page" content="content" />
                </Head>
                <main className={`w-full min-h-[800px] min-w-[1680px] bg-neutral-800 flex flex-row ${myInfo.theme}`}>
                    <Toaster
                        position={'top-right'}
                        reverseOrder={false}
                        toastOptions={{
                            style: {
                                fontSize: '18px'
                            }
                        }}
                    />
                    <DirectMessages className="w-[28%] min-h-[100%]" activeUsers={activeUsers}/>
                    <MessagesWinow className="w-[72%] min-h-[100%] z-10" activeUsers={activeUsers}/>
                </main>
            </>
        )
    }
}
