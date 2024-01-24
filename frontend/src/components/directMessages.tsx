import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import profilePicturePlaceholder from '@/profilePicturePlaceholder.png'
import dots from '@/dots.png'
import editing from '@/edit.png'
import searchIcon from '@/loupe.png'
import { getSelectedFriend, getFriends } from "@/store/actions/messengerAction"
import { userLogout, uploadUserProfileImage } from "@/store/actions/authAction";
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import moment from 'moment'
import seen from '@/seen.png'
import delivered from '@/read.png'
import defaultStatus from '@/default.png'
import { Socket, io } from "socket.io-client";
import logoutIcon from '@/logout.png'
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { BsImage } from "react-icons/bs";

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

    const inputProfileImage = useRef<HTMLInputElement | null>(null);
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
        const socket = io("ws://localhost:8000", {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });
        socketRef.current = socket
    }, [])

    const selectInputMedia = () => {
        if (inputProfileImage.current) {
            inputProfileImage.current.click()
        }
    }

    const mediaSelected = (e: ChangeEvent<HTMLInputElement>) => {

        const formData = new FormData()
        if (e.target.files) {
            formData.append('profileImage', e.target.files[0]);
            formData.append('profileImageName', Date.now() + e.target.files[0].name);
            dispatch(uploadUserProfileImage(formData))
        }

    }

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

        if (socketRef.current && myInfo) {
            socketRef.current.emit('userProfilePictureUpdate', myInfo.id)
        }
    }, [myInfo])

    return (
        <>
            <div className={`border-r-2 border-darkBgPrimary z-20 bg-darkBgMain ${className}`}>
                <div className="w-full h-screen flex flex-col gap-4 justify-start items-center shrink-0 z-20 bg-darkBgMain">
                    <div className="topbar z-20 w-full min-h-[70px] flex flex-row justify-between items-center px-6 border-b-2 border-darkBgPrimary bg-gradient-to-l from-orange via-magneta to-crayola">
                        <div className="flex flex-row gap-2 justify-center items-center">
                            {
                                myInfo && myInfo.profileImage ?
                                    <img
                                        src={`/userProfileImages/${myInfo.profileImage}`}
                                        alt="profilePicturePlaceholder"
                                        className="object-cover rounded-full border-2 border-green-600"
                                        width={55}
                                        height={55}/>
                                :
                                    <Image
                                        src={profilePicturePlaceholder}
                                        alt='profilePicturePlaceholder'
                                        width={50} height={50}
                                        className="rounded-full"
                                        priority />
                            }
                            <h2 className="font-semibold text-2xl w-full text-center text-black">
                                {isClient? myInfo?.username : " "}
                            </h2>
                        </div>
                        <div className="flex flex-row gap-4 justify-center items-center">
                            <button onClick={() => selectInputMedia()}>
                                <Image
                                    src={editing}
                                    alt='changeAvatarIcon'
                                    width={25}
                                    height={25}
                                    className="mb-1.5"
                                    priority
                                />
                                <input onChange={mediaSelected} multiple={false} type="file" id="inputFile" ref={inputProfileImage} style={{ display: "none" }} />
                            </button>
                            <button onClick={() => logout()}>
                                <Image
                                    src={logoutIcon}
                                    alt='logoutIcon'
                                    width={25}
                                    height={25}
                                    priority
                                />
                            </button>

                        </div>

                    </div>
                    
                    <div className="searchBar z-20 w-[95%] min-h-[50px] mt-4 mb-2 flex flex-row justify-center items-center gap-4  bg-darkBgPrimary rounded-full">
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

                    <div className="contactsList z-20 w-[100%] min-h-fit flex-col justify-start items-center overflow-y-scroll no-scrollbar">
                        {
                            friendsList?.map((e:any, index: React.Key | null | undefined) => {
                                return (
                                    <button key={index} className=" w-full hover:bg-zinc-800 active:bg-zinc-800 flex justify-center items-center">
                                        <div className="bg-transparent w-[95%] border-b-2 border-darkBgPrimary flex flex-row justify-start items-center px-4 py-6 gap-4"
                                            onClick={async () => await dispatch(getSelectedFriend(e))}
                                        >
                                            <div className="flex flex-row justify-center items-end -space-x-4">
                                                {
                                                    e.profileImage !== '' ?
                                                        <img
                                                            src={`/userProfileImages/${e.profileImage}`}
                                                            alt="profilePicturePlaceholder"
                                                            className="object-cover rounded-full"
                                                            width={65}
                                                            height={65} />
                                                        :
                                                        <Image
                                                            src={profilePicturePlaceholder}
                                                            alt='profilePicturePlaceholder'
                                                            width={65}
                                                            height={65}
                                                            className="rounded-full"
                                                            priority />
                                                }
                                                
                                                {
                                                    activeUsers && activeUsers.find((user: any) => user.userId === e._id) ?
                                                        <div className="w-4 h-4 bg-green-500 rounded-full relative border-2 border-darkBgMain"></div> : ''
                                                }
                                            </div>

                                            <div className="flex flex-row gap-2 justify-between items-start w-full">
                                                <div className="flex flex-col gap-2 justify-center items-start w-[68%]">
                                                    <h2 className="text-xl font-normal text-white">{e.username}</h2>
                                                    <p className={`${e.lastMessageInfo ? (e.lastMessageInfo.status === 'delivered' && myInfo && e.lastMessageInfo.senderId !== myInfo.id) ? 'font-extrabold' : 'font-normal' : '' } line-clamp-1 break-all text-left`}>
                                                        {
                                                            e.lastMessageInfo && (e.lastMessageInfo.message !== undefined) ? (e.lastMessageInfo.message.text === '' ? <div className="flex-row flex gap-2"><BsImage className="w-5 h-5" /><p>Media</p></div>  : e.lastMessageInfo.message.text) : "No messages yet"
                                                        }
                                                    </p>
                                                </div>
                                                <div className="flex flex-col gap-[5px] justify-center items-end">
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