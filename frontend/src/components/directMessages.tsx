import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import profilePicturePlaceholder from '@/profilePicturePlaceholder.png'
import dots from '@/dots.png'
import editing from '@/editing.png'
import read from '@/read.png'
import searchIcon from '@/loupe.png'
import { getSelectedFriend } from "@/store/actions/messengerAction"
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import moment from 'moment'
import seen from '@/seen.png'

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

    const { lastMessages, friends } = useAppSelector(state => state.messenger)
    const [lastIndex, setLastIndex] = useState(null)
    const dispatch = useAppDispatch()

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        if (myInfo) {
            setIsClient(true)
        }
    }, [myInfo])

    useEffect(() => {
        
    }, [friends])

    return (
        <>
            <div className={` ${className}`}>
                <div className="w-full h-screen flex flex-col gap-4 justify-start items-center shrink-0">
                    <div className="topbar w-full min-h-[9%] flex flex-row justify-between items-center px-6 bg-gray-500">
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
                        <div className="flex flex-row gap-2 justify-center items-center">
                            <Image src={editing} alt='editingIcon' width={25} height={25} className=""
                                priority
                                sizes="(max-width: 768px) 100vw,
                                           (max-width: 1200px) 50vw,
                                           50vw"
                            />
                            <Image src={dots} alt='dotsIcon' width={25} height={25} className=""
                                priority
                                sizes="(max-width: 768px) 100vw,
                                           (max-width: 1200px) 50vw,
                                           50vw"
                            />
                        </div>

                    </div>
                    
                    <div className="searchBar w-[95%] min-h-[5%] flex flex-row justify-center items-center gap-4 bg-white rounded-full">
                        <Image src={searchIcon} alt='serachIcon' width={30} height={30} className="ml-4"
                            priority
                            sizes="(max-width: 768px) 100vw,
                                           (max-width: 1200px) 50vw,
                                           50vw"
                        />
                        <div className="text-md text-black w-[85%] mr-4">
                            <input className="w-full">
                            </input>
                        </div>
                    </div>

                    <div className="contactsList w-[95%] bg-gray-500 flex-col justify-start items-center overflow-y-scroll no-scrollbar">
                        {
                            friends?.map((e:any, index: React.Key | null | undefined) => {
                                return (
                                    <button key={index} className=" w-full border-b-2 hover:bg-cyan-700 focus:bg-cyan-700">
                                        <div className="bg-transparent w-full flex flex-row justify-start 
                                    items-center px-4 py-4 gap-4"
                                            onClick={async () => await dispatch(getSelectedFriend(e))}
                                        >
                                            <div>
                                                <Image src={profilePicturePlaceholder} alt='profilePicturePlaceholder' width={60} height={60} className="rounded-full"
                                                    priority
                                                    sizes="(max-width: 768px) 100vw,
                                                        (max-width: 1200px) 50vw,
                                                        50vw"
                                                />
                                                {
                                                    activeUsers && activeUsers.find((user: any) => user.userId === e._id) ?
                                                        <div className="w-3 h-3 bg-green-500 rounded-full relative border-2 bottom-[14px] left-[40px]"></div> : ''
                                                }
                                            </div>

                                            <div className="flex flex-row justify-between items-center w-full">
                                                <div className="flex flex-col justify-center items-start">
                                                    <h2>{e.username}</h2>
                                                    <p>{
                                                        //(index && lastIndex === index && lastMessage)? console.log(lastMessages) :
                                                        e.lastMessageInfo ? e.lastMessageInfo.message.text : "No messages yet"}</p>
                                                </div>
                                                <div className="flex flex-col justify-center items-end">
                                                    <p>{e.lastMessageInfo ? moment(e.lastMessageInfo.createdAt).startOf('minute').fromNow() : "-"}</p>
                                                    {
                                                        (isClient && e.lastMessageInfo) ? myInfo?.id === e.lastMessageInfo.senderId ?
                                                            
                                                                e.lastMessageInfo.status === 'seen'?
                                                                <Image src={seen} alt='readIcon' width={25} height={25} className="rounded-full" priority />
                                                                :
                                                                <Image src={read} alt='readIcon' width={25} height={25} className="rounded-full" priority />
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