import Head from "next/head"
import React, { useEffect, useState } from "react"
import DirectMessages from "@/components/directMessages"
import MessagesWinow from "@/components/messagesWindow"
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getFriends } from "@/store/actions/messengerAction"
import { useRouter } from 'next/router'
import { Toaster } from 'react-hot-toast'
import { socket } from "@/socket"

export default function Home() {

    const { newUserAdded } = useAppSelector(state => state.messenger)
    const { authenticate, myInfo } = useAppSelector(state => state.auth);

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
    }, [])

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
                <main className={`w-full min-h-[100px] min-w-[1280px] bg-neutral-800 flex flex-row ${myInfo.theme}`}>
                    <Toaster
                        position={'top-right'}
                        reverseOrder={false}
                        toastOptions={{
                            style: {
                                fontSize: '18px'
                            }
                        }}
                    />
                    <DirectMessages className="w-[28%] min-h-[100%]"/>
                    <MessagesWinow className="w-[72%] min-h-[100%] z-10"/>
                </main>
            </>
        )
    }
}
