import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import profilePicturePlaceholder from '@/profilePicturePlaceholder.png'
import dots from '@/dots.png'
import editing from '@/edit.png'
import delivered from '@/read.png'
import searchIcon from '@/loupe.png'
import { getSelectedFriend } from "@/store/actions/messengerAction"
import { userLogout } from "@/store/actions/authAction";
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import moment from 'moment'
import seen from '@/seen.png'
import defaultStatus from '@/default.png'
import { Socket, io } from "socket.io-client";
import logoutIcon from '@/logout.png'

interface Dictionary<T> {
    [Key: string]: T;
}

interface DirectMessagesProps {
    className?: string,
    myInfo?: Dictionary<string>
    activeUsers?: Dictionary<string>[]
}

interface LastMessage {
    createdAt : string
    message: {
        text: string,
        image: string[]
    }
    receiverId: string,
    senderId: string,
    status: string,
    updatedAt: string,
    __v: number
    _id: string
}

const DirectMessages: FC<DirectMessagesProps> = ({ className, myInfo, activeUsers }) => {

    const { friends } = useAppSelector(state => state.messenger)
    const [friendsList, setFriendList] = useState(friends)
    const dispatch = useAppDispatch()

    const [isClient, setIsClient] = useState(false)

    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        const socket = io("ws://localhost:8000", {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });
        socketRef.current = socket
    }, [])

    const logout = () => {
        dispatch(userLogout());
        if (socketRef.current && myInfo) {
            socketRef.current.emit('logout', myInfo.id)
        }
    }

    const serachFriend = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 0) {
            setFriendList(friendsList.filter((friend: any) => friend.username.includes(e.target.value)))
        } else {
            setFriendList(friends)
        }
    }

    useEffect(() => {
        setFriendList(friends)
    }, [friends])

    useEffect(() => {
        if (myInfo) {
            setIsClient(true)
        }
    }, [myInfo])


    return (
        <>
            <div className={`border-r-2 border-darkBgPrimary ${className}`}>
                <div className="w-full h-screen flex flex-col gap-4 justify-start items-center shrink-0">
                    <div className="topbar w-full min-h-[7%] flex flex-row justify-between items-center px-6 border-b-2 border-darkBgPrimary bg-gradient-to-l from-orange via-magneta to-crayola">
                        <div className="flex flex-row gap-2 justify-center items-center">
                            <Image src={profilePicturePlaceholder} alt='profilePicturePlaceholder' width={50} height={50} className="rounded-full"
                                priority
                                sizes="(max-width: 768px) 100vw,
                                           (max-width: 1200px) 50vw,
                                           50vw"
                            />
                            <h2 className="font-semibold text-2xl w-full text-center text-black">
                                {isClient? myInfo?.username : " "}
                            </h2>
                        </div>
                        <div className="flex flex-row gap-4 justify-center items-center">
                            <Image src={editing} alt='dotsIcon' width={25} height={25} className="mb-1.5"
                                priority
                                sizes="(max-width: 768px) 100vw,
                                           (max-width: 1200px) 50vw,
                                           50vw"
                            />
                            <Image src={logoutIcon} alt='editingIcon' width={25} height={25} className=""
                                priority
                                sizes="(max-width: 768px) 100vw,
                                           (max-width: 1200px) 50vw,
                                           50vw"
                                onClick={() => logout()}
                            />
                        </div>

                    </div>
                    
                    <div className="searchBar w-[95%] min-h-[5%] mt-4 mb-2 flex flex-row justify-center items-center gap-4  bg-darkBgPrimary rounded-full">
                        <Image src={searchIcon} alt='serachIcon' width={30} height={30} className="ml-4"
                            priority
                            sizes="(max-width: 768px) 100vw,
                                           (max-width: 1200px) 50vw,
                                           50vw"
                        />
                        <div className="text-md text-white w-[85%] mr-4">
                            <input className="w-full bg-darkBgPrimary" onChange={serachFriend} type="text">
                            </input>
                        </div>
                    </div>

                    <div className="contactsList w-[95%] flex-col justify-start items-center overflow-y-scroll no-scrollbar">
                        {
                            friendsList?.map((e:any, index: React.Key | null | undefined) => {
                                return (
                                    <button key={index} className=" w-full border-b-2 border-darkBgPrimary hover:bg-cyan-700 focus:bg-cyan-700">
                                        <div className="bg-transparent w-full flex flex-row justify-start 
                                    items-center px-4 py-6 gap-4"
                                            onClick={async () => await dispatch(getSelectedFriend(e))}
                                        >
                                            <div className="flex flex-row justify-center items-end -space-x-4">
                                                <Image src={profilePicturePlaceholder} alt='profilePicturePlaceholder' width={60} height={60} className="rounded-full"
                                                    priority
                                                    sizes="(max-width: 768px) 100vw,
                                                        (max-width: 1200px) 50vw,
                                                        50vw"
                                                />
                                                {
                                                    activeUsers && activeUsers.find((user: any) => user.userId === e._id) ?
                                                        <div className="w-4 h-4 bg-green-500 rounded-full relative border-2 border-darkBgMain"></div> : ''
                                                }
                                            </div>

                                            <div className="flex flex-row gap-2 justify-between items-start w-full">
                                                <div className="flex flex-col gap-1 justify-center items-start w-[68%]">
                                                    <h2 className="text-xl font-normal text-white">{e.username}</h2>
                                                    <p className={`${e.lastMessageInfo ? (e.lastMessageInfo.status === 'delivered' && myInfo && e.lastMessageInfo.senderId !== myInfo.id) ? 'font-extrabold' : 'font-normal' : '' } line-clamp-1 break-all text-left`}>
                                                        {
                                                        //(index && lastIndex === index && lastMessage)? console.log(lastMessages) :
                                                            e.lastMessageInfo && (e.lastMessageInfo.message !== undefined) ? e.lastMessageInfo.message.text : "No messages yet"
                                                        }
                                                    </p>
                                                </div>
                                                <div className="flex flex-col gap-2 justify-center items-end">
                                                    <p className="text-gray-400">{e.lastMessageInfo ? moment(e.lastMessageInfo.createdAt).startOf('minute').fromNow() : "-"}</p>
                                                    {
                                                        (isClient && e.lastMessageInfo) ? myInfo?.id === e.lastMessageInfo.senderId ?
                                                            
                                                                e.lastMessageInfo.status === 'seen'?
                                                                <Image src={seen} alt='readIcon' width={25} height={25} className="rounded-full" priority />
                                                                :
                                                                    e.lastMessageInfo.status === 'delivered' ?
                                                                    <Image src={delivered} alt='readIcon' width={25} height={25} className="rounded-full" priority />
                                                                    :
                                                                    <Image src={defaultStatus} alt='readIcon' width={25} height={25} className="rounded-full" priority />
                                                             : '' : ''
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                )
                            }) 
                        }
                    </div>

                </div>

            </div>
        </>
    )
}

export default DirectMessages;