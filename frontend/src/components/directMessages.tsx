import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import profilePicturePlaceholder from '@/profilePicturePlaceholder.png'
import dots from '@/dots.png'
import searchIcon from '@/loupe.png'
import { getSelectedFriend } from "@/store/actions/selectedFriendAction"
import { userLogout, uploadUserProfileImage, updateUserTheme, updateUserName, updateUserStatus } from "@/store/actions/authAction";
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import moment from 'moment'
import seen from '@/seen.png'
import delivered from '@/read.png'
import defaultStatus from '@/default.png'
import { Socket, io } from "socket.io-client";
import { BsImage } from "react-icons/bs";
import { RxExit } from "react-icons/rx";
import { CiEdit } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";
import { IoChevronBackOutline } from "react-icons/io5";
import { SlPencil } from "react-icons/sl";
import { FaCheck } from "react-icons/fa6";
import { motion } from "framer-motion"


interface Dictionary<T> {
    [Key: string]: T;
}

interface DirectMessagesProps {
    className?: string,
    myInfo?: Dictionary<string>
    activeUsers?: SocketUser[]
}

interface LastMessage {
    message: {
        text: string,
        image: string[]
    },
    _id: string,
    senderId: string,
    senderName: string,
    receiverId: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    __v: number
}

interface Friend {
    _id: string,
    username: string,
    password: string,
    profileImage: string,
    status: string,
    theme: string,
    createdAt: string,
    updatedAt: string,
    __v: number,
    lastMessageInfo: LastMessage
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

const DirectMessages: FC<DirectMessagesProps> = ({ className }) => {

    const variantsEditProfileMenu = {
        open: { width: ['0%', '100%'] },
        closed: { width: ['100%', '0%'] },
    }

    const { myInfo } = useAppSelector(state => state.auth);
    const { friends } = useAppSelector(state => state.messenger)
    const { selectedFriendData } = useAppSelector(state => state.selectedFriend)
    const [friendsList, setFriendList] = useState(friends)
    const dispatch = useAppDispatch()

    const colorPalette = ['bg-bgMain', 'bg-bgPrimary', 'bg-gradientOne', 'bg-gradientTwo', 'bg-gradientThree']

    const [isClient, setIsClient] = useState(false)
    const [isMenuOpen, setMenuOpen] = useState(false)
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false)
    const [friendIndex, setFriendIndex] = useState<React.Key | null>(null)

    const currentUserInfo: Dictionary<string> = myInfo

    const inputProfileImage = useRef<HTMLInputElement | null>(null);
    const inputUserName = useRef<HTMLInputElement | null>(null)
    const inputUserStatus = useRef<HTMLInputElement | null>(null)
    const socketRef = useRef<Socket | null>(null)

    const [inputState, setInputState] = useState({
        username: String(currentUserInfo.username) || '',
        status: String(currentUserInfo.status) || '',
    })

    const [isUsernameInputDisabled, setUsernameInputDisabled] = useState(true)
    const [isStatusInputDisabled, setStatusInputDisabled] = useState(true)

    const [activeUsers, setActiveUsers] = useState<Array<SocketUser>>([])

    // User profile functions

    const editUsernameClicked = () => {
        setUsernameInputDisabled(false)
        setTimeout(() => {
            inputUserName.current?.focus()
        }, 200)
    }

    const handleUsernameEditingDone = (newUsername: string) => {
        if (newUsername !== currentUserInfo.username) {
            dispatch(updateUserName(JSON.stringify({ name: newUsername })))
        }
    }

    const handleStatusEditingDone = (newStatus: string) => {
        if (newStatus !== currentUserInfo.status) {
            dispatch(updateUserStatus(JSON.stringify({ status: newStatus })))
        }
    }

    const editStatusClicked = () => {
        setStatusInputDisabled(false)
        setTimeout(() => {
            inputUserStatus.current?.focus()
        }, 200)
    }

    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setInputState({
            ...inputState,
            [e.target.name]: e.target.value
        })
    }

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

    const themeSelected = (theme: string) => {
        dispatch(updateUserTheme(JSON.stringify({ theme: theme })))
    }

    const logout = () => {
        dispatch(userLogout());
        if (socketRef.current && myInfo) {
            socketRef.current.emit('logout', currentUserInfo.id)
        }
    }

    const handleMenuClick = () => {
        setMenuOpen(!isMenuOpen)
    }

    const searchFriend = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 0) {
            setFriendList(friendsList.filter((friend: Friend) => friend.username.includes(e.target.value)))
        } else {
            setFriendList(friends)
        }
    }

    useEffect(() => {
        const socket = io("ws://localhost:8000", {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });
        socketRef.current = socket

        socketRef.current.on('getUser', (users: SocketUser[]) => {
            const filteredUsers = users.filter((user: SocketUser) => user.userId !== currentUserInfo.id)
            setActiveUsers(filteredUsers)
        })
    }, [])

    useEffect(() => {
        var sortedFriendList = friends.slice(0);
        sortedFriendList.sort(function (a: Friend, b: Friend) {
            if (a.lastMessageInfo && b.lastMessageInfo) {
                var dateA = new Date(a.lastMessageInfo.createdAt).getTime()
                var dateB = new Date(b.lastMessageInfo.createdAt).getTime()
                return dateA > dateB ? -1 : dateA < dateB ? 1 : 0
            }
            if (!a.lastMessageInfo) {
                return 1
            }

            if (!b.lastMessageInfo) {
                return -1
            }
            return 0
        })

        setFriendList(sortedFriendList)

        if (friendIndex !== null && sortedFriendList[Number(friendIndex)]._id === selectedFriendData._id) {
            dispatch(getSelectedFriend(sortedFriendList[Number(friendIndex)]))
        }
    }, [friends])

    useEffect(() => {
        if (myInfo) {
            setIsClient(true)
        }
    }, [myInfo])

    useEffect(() => {
        if (socketRef.current && currentUserInfo) {
            socketRef.current.emit('userProfileInfoUpdate', currentUserInfo.id)
        }
    }, [currentUserInfo.status, currentUserInfo.username, currentUserInfo.profileImage])

    return (
        <>
            <div className={`border-r-2 border-bgPrimary z-20 bg-bgMain ${className}`} >
                <div className="w-full h-screen" style={{ 'position': 'relative' }}>

                    <div className={`w-full h-full flex flex-col gap-4 justify-start items-center shrink-0 z-20`}>

                        {/* TOP BAR */}
                        <div
                            className={`topbar relative z-30 w-full min-h-[70px] flex flex-row justify-between items-center px-6 border-b-2 border-bgPrimary 
                                        bg-gradient-to-l from-gradientOne via-gradientTwo to-gradientThree`}
                            style={{ 'position': 'relative' }}
                        >
                            <button
                                onClick={() => setProfileMenuOpen(true)}
                                className="flex flex-row gap-2 justify-center items-center">
                                {
                                    currentUserInfo && currentUserInfo.profileImage ?
                                        <img
                                            src={`/userProfileImages/${currentUserInfo.profileImage}`}
                                            alt="profilePicturePlaceholder"
                                            className="object-cover rounded-full border-[2.5px] border-darkBgMain min-w-[50px] min-h-[50px] max-w-[50px] 
                                            max-h-[50px]" />
                                        :
                                        <Image
                                            src={profilePicturePlaceholder}
                                            alt='profilePicturePlaceholder'
                                            width={50} height={50}
                                            className="object-cover rounded-full border-[2.5px] border-darkBgMain min-w-[50px] min-h-[50px] max-w-[50px] 
                                            max-h-[50px]"
                                            priority />
                                }
                                <h2 className="text-2xl w-full text-center text-black line-clamp-1 break-words">
                                    {isClient ? currentUserInfo?.username : " "}
                                </h2>
                            </button>
                            <div className="flex flex-row gap-4 justify-center items-center">
                                <motion.button
                                    whileTap={{ backgroundColor: 'rgba(0, 0, 0, 0.32)' }}
                                    className="rounded-full w-[45px] h-[45px] flex justify-center items-center"
                                    onClick={() => handleMenuClick()}>
                                    <Image src={dots} alt='dotsIcon' width={25} height={25} className="rounded-full" priority />
                                </motion.button>
                            </div>

                            {/* DROPDOWN MENU */}
                            <div className={`flex-col text-black w-[220px] justify-center rounded-md absolute h-auto bg-bgPrimary right-0 top-[80%] 
                                            mr-10 shadow-lg bg-gradient-to-l from-gradientOne to-gradientTwo border border-bgPrimary
                                            ${isMenuOpen ? 'flex' : 'hidden'}`}>

                                <button
                                    onClick={() => logout()}
                                    className="flex flex-row justify-between items-center text-xl w-full py-2 px-2 border-b 
                                               border-bgPrimary text-left hover:bg-gradientThree hover:text-white rounded-t-md">
                                    <p className="">Logout</p>
                                    <RxExit className="mr-[2px]" />
                                </button>

                                <button
                                    onClick={() => setProfileMenuOpen(true)}
                                    className="flex flex-row justify-between items-center text-xl w-full 
                                               py-2 px-2 text-left hover:bg-gradientThree hover:text-white border-b border-bgPrimary">
                                    <p>Settings</p>
                                    <CiSettings className="w-[25px] h-[25px]" />
                                </button>

                                <div
                                    style={{ 'position': 'relative' }}
                                    className="flex text-xl w-full py-2 px-2 text-left hover:bg-gradientThree 
                                             hover:text-white rounded-b-md group">

                                    <button className="flex flex-row justify-between items-center w-full">
                                        <p>Theme</p>
                                        <CiEdit className="w-[25px] h-[25px]" />
                                    </button>

                                    {/* THEME DROPDOWN MENU */}
                                    <div className={`flex-col text-black absolute top-0 right-0 w-[240px] h-auto translate-x-[100%] group-hover:block hidden 
                                                    z-50 border border-bgPrimary bg-gradient-to-r from-gradientOne to-gradientTwo rounded-tr-lg rounded-b-lg`}>

                                        <button
                                            disabled={currentUserInfo && currentUserInfo.theme === 'sunset' ? true : false}
                                            onClick={() => themeSelected('sunset')}
                                            className="flex flex-row justify-between items-center w-full py-2 px-2 border-b rounded-tr-lg border-bgPrimary 
                                                       hover:bg-gradientThree hover:text-white">
                                            <p>Sunset</p>
                                            <div className="flex flex-row justify-center items-center w-auto h-auto gap-2">
                                                {
                                                    colorPalette.map((color, index) => {
                                                        return (
                                                            <div
                                                                key={index}
                                                                className={`w-[15px] h-[15px] ${color} rounded-full border border-black sunset 
                                                                            ${currentUserInfo && currentUserInfo.theme === 'sunset' ? 'border-2 border-white w-[18px] h-[18px]' : ''}`} />
                                                        )
                                                    })
                                                }
                                            </div>
                                        </button>

                                        <button
                                            disabled={currentUserInfo && currentUserInfo.theme === 'azure' ? true : false}
                                            onClick={() => themeSelected('azure')}
                                            className="flex flex-row justify-between items-center w-full py-2 px-2 border-b border-bgPrimary 
                                                       hover:bg-gradientThree hover:text-white">
                                            <p>Azure</p>
                                            <div className="flex flex-row justify-center items-center w-auto h-auto gap-2">
                                                {
                                                    colorPalette.map((color, index) => {
                                                        return (
                                                            <div
                                                                key={index}
                                                                className={`w-[15px] h-[15px] ${color} rounded-full border border-black azure 
                                                                            ${currentUserInfo && currentUserInfo.theme === 'azure' ? 'border-2 border-white w-[18px] h-[18px]' : ''}`} />
                                                        )
                                                    })
                                                }
                                            </div>
                                        </button>
                                        <button
                                            disabled={currentUserInfo && currentUserInfo.theme === 'midnight' ? true : false}
                                            onClick={() => themeSelected('midnight')}
                                            className="flex flex-row justify-between items-center w-full py-2 px-2 hover:bg-gradientThree 
                                                       hover:text-white rounded-b-lg">
                                            <p>Midnight</p>
                                            <div className="flex flex-row justify-center items-center w-auto h-auto gap-2">
                                                {
                                                    colorPalette.map((color, index) => {
                                                        return (
                                                            <div
                                                                key={index}
                                                                className={`w-[15px] h-[15px] ${color} rounded-full border border-black midnight 
                                                                            ${currentUserInfo && currentUserInfo.theme === 'midnight' ? 'border-2 border-white w-[18px] h-[18px]' : ''}`} />
                                                        )
                                                    })
                                                }
                                            </div>
                                        </button>

                                    </div>
                                </div>

                            </div>

                        </div>

                        {/* SEARCH BAR*/}
                        <div className="searchBar z-20 w-[95%] min-h-[50px] mt-4 mb-2 flex flex-row justify-center items-center gap-4  bg-bgPrimary rounded-full">
                            <Image src={searchIcon} alt='serachIcon' width={30} height={30} className="ml-4"
                                priority
                                sizes="(max-width: 768px) 100vw,
                                           (max-width: 1200px) 50vw,
                                           50vw"
                            />
                            <div className="text-md text-white w-[85%] mr-4">
                                <input className="w-full bg-bgPrimary" onChange={searchFriend} type="text">
                                </input>
                            </div>
                        </div>

                        {/* CONTACT LIST */}
                        <div className="contactsList z-20 w-[100%] min-h-fit flex-col justify-start items-center overflow-y-scroll no-scrollbar">
                            {
                                friendsList?.map((e: Friend, index: number) => {
                                    return (
                                        <button key={index} className=" w-full hover:bg-bgPrimary active:bg-Primary flex justify-center items-center">
                                            <div className="bg-transparent w-[95%] border-b-2 border-bgPrimary flex flex-row justify-start items-center px-4 py-6 gap-4"
                                                onClick={async () => [await dispatch(getSelectedFriend(e)), setFriendIndex(index)]}
                                            >
                                                <div className="flex flex-row justify-center items-end -space-x-4">
                                                    {
                                                        e.profileImage !== '' ?
                                                            <img
                                                                src={`/userProfileImages/${e.profileImage}`}
                                                                alt="profilePicturePlaceholder"
                                                                className="object-cover rounded-full min-h-[65px] min-w-[65px] max-h-[65px] max-w-[65px]" />
                                                            :
                                                            <Image
                                                                src={profilePicturePlaceholder}
                                                                alt='profilePicturePlaceholder'
                                                                className="rounded-full min-w-[65px] max-h-[65px] max-w-[65px]"
                                                                priority />
                                                    }

                                                    {
                                                        activeUsers && activeUsers.find((user: SocketUser) => user.userId === e._id) ?
                                                            <div className="w-4 h-4 bg-green-500 rounded-full relative border-2 border-bgMain"></div> : ''
                                                    }
                                                </div>

                                                <div className="flex flex-col gap-2 justify-center items-start w-full">

                                                    <div className="flex flex-row gap-2 justify-between items-start w-[100%]">
                                                        <h2 className="text-xl font-normal text-white">{e.username}</h2>
                                                        <p className="text-gray-400">{e.lastMessageInfo ? moment(e.lastMessageInfo.createdAt).startOf('minute').fromNow() : "-"}</p>

                                                    </div>

                                                    <div className="flex flex-row gap-6 justify-between items-start w-[100%]">
                                                        <span className={
                                                            `${e.lastMessageInfo && (e.lastMessageInfo.status === 'delivered' && myInfo && e.lastMessageInfo.senderId !== currentUserInfo.id) ?
                                                                'font-extrabold'
                                                                :
                                                                'font-normal'} line-clamp-1 break-all text-left`
                                                        }>
                                                            {
                                                                e.lastMessageInfo && (e.lastMessageInfo.message !== undefined) ?
                                                                    (e.lastMessageInfo.message.text === '' ?
                                                                        <div className="flex-row flex gap-2"><BsImage className="w-5 h-5" /><p>Media</p></div>
                                                                        :
                                                                        <p>{e.lastMessageInfo.message.text}</p>) 
                                                                    :
                                                                    "No messages yet"
                                                            }
                                                        </span>
                                                        {
                                                            e.lastMessageInfo && e.lastMessageInfo.status?
                                                                currentUserInfo?.id === e.lastMessageInfo.senderId ?
                                                                    e.lastMessageInfo.status === 'seen' ?
                                                                        <Image src={seen} alt='readIcon' width={25} height={25} className="rounded-full" priority />
                                                                        :
                                                                        e.lastMessageInfo.status === 'delivered' ?
                                                                            <Image src={delivered} alt='deliveredIcon' width={25} height={25} className="rounded-full" priority />
                                                                            :
                                                                            <Image src={defaultStatus} alt='sentIcon' width={25} height={25} className="rounded-full" priority />
                                                                    :
                                                                    '' //The message was sent by the other user, therefore no need for an status icon
                                                                :
                                                                '' //There are no messages between the users
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

                    {/* PROFILE EDIT*/}
                    <motion.div
                        initial={false}
                        animate={isProfileMenuOpen ? "open" : "closed"}
                        variants={variantsEditProfileMenu}
                        transition={{
                            opacity: { ease: 'linear' },
                            layout: { duration: 0.3 },
                        }}
                        className={`w-full h-screen top-0 absolute flex-col gap-4 justify-start items-center shrink-0 z-30 bg-bgMain overflow-hidden flex`}>

                        {/* TOP BAR */}
                        <div
                            className="topbar relative z-30 w-full min-h-[70px] flex flex-row justify-between items-center px-6 border-b-2 border-bgPrimary bg-gradient-to-l from-gradientOne via-gradientTwo to-gradientThree"
                            style={{ 'position': 'relative' }}
                        >
                            <motion.button
                                whileTap={{ backgroundColor: 'rgba(0, 0, 0, 0.32)' }}
                                className="rounded-full w-[45px] h-[45px] flex justify-center items-center"
                                onClick={() => setProfileMenuOpen(false)}>
                                <IoChevronBackOutline className="min-w-[35px] min-h-[35px] text-bgPrimary" />
                            </motion.button>
                        </div>

                        {/* PROFILE VIEW & EDIT */}
                        <div className="flex flex-col justify-start items-center w-full h-full gap-16">
                            {/* EDIT PROFILE PHOTO */}
                            <button
                                onClick={() => selectInputMedia()}
                                className="mt-10 group relative">
                                {
                                    myInfo && currentUserInfo.profileImage ?
                                        <img
                                            src={`/userProfileImages/${currentUserInfo.profileImage}`}
                                            alt="profilePicturePlaceholder"
                                            className="object-cover rounded-full border-[2.5px] border-darkBgMain w-[200px] h-[200px]" />
                                        :
                                        <Image
                                            src={profilePicturePlaceholder}
                                            alt='profilePicturePlaceholder'
                                            width={200} height={200}
                                            className="object-cover rounded-full border-[2.5px] border-darkBgMain w-[200px] h-[200px]"
                                            priority />
                                }
                                <div className="min-w-[200px] min-h-[200px] top-0 absolute rounded-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center" >
                                    <CiEdit className="min-w-[50px] min-h-[50px]" />
                                    <p className="text-lg">
                                        Edit Picture
                                    </p>
                                </div>
                                <input onChange={mediaSelected} multiple={false} type="file" id="inputFile" ref={inputProfileImage} style={{ display: "none" }} />
                            </button>

                            {/* EDIT NAME */}
                            <div className="w-[80%] flex flex-col justify-center items-center gap-10">
                                <div className="w-full flex flex-col justify-center items-start gap-4">
                                    <p className=" text-gray-400">
                                        Your Name:
                                    </p>
                                    <div className={`w-full ${isUsernameInputDisabled === false ? 'border-b-2' : ''} flex flex-row justify-center items-start relative`}>
                                        <input
                                            onChange={inputHandler}
                                            name="username"
                                            value={inputState.username}
                                            ref={inputUserName}
                                            disabled={isUsernameInputDisabled}
                                            maxLength={25}
                                            id="usernameInput"
                                            className="peer bg-bgMain w-full text-xl mb-2 outline-none">
                                        </input>
                                        <span className={`mr-10 text-lg ${isUsernameInputDisabled === true ? 'hidden' : ''}`}>
                                            {25 - inputState.username.length}
                                        </span>
                                        <button onClick={editUsernameClicked} className={`${isUsernameInputDisabled === false ? 'hidden' : ''} absolute right-0 bottom-3`}>
                                            <SlPencil className="w-6 h-6" />
                                        </button>
                                        <button onClick={() => [setUsernameInputDisabled(true), handleUsernameEditingDone(inputState.username)]} className={`${isUsernameInputDisabled === true ? 'hidden' : ''} absolute right-0`}>
                                            <FaCheck className="w-[27px] h-[27px]" />
                                        </button>

                                    </div>
                                </div>

                                {/* EDIT STATUS */}
                                <div className="w-full flex flex-col justify-center items-start gap-4">
                                    <p className=" text-gray-400">
                                        Status:
                                    </p>
                                    <div className={`w-full ${isStatusInputDisabled === false ? 'border-b-2' : ''} flex flex-row justify-center items-start relative`}>
                                        <input
                                            onChange={inputHandler}
                                            name="status"
                                            disabled={isStatusInputDisabled}
                                            value={inputState.status}
                                            ref={inputUserStatus}
                                            maxLength={36}
                                            className="peer bg-bgMain text-xl mb-2 w-full outline-none">
                                        </input>
                                        <span className={`mr-10 text-lg ${isStatusInputDisabled === true ? 'hidden' : ''}`}>
                                            {36 - inputState.status.length}
                                        </span>
                                        <button onClick={editStatusClicked} className={`${isStatusInputDisabled === false ? 'hidden' : ''} absolute right-0 bottom-3`}>
                                            <SlPencil className="w-6 h-6" />
                                        </button>
                                        <button onClick={() => [setStatusInputDisabled(true), handleStatusEditingDone(inputState.status)]} className={`${isStatusInputDisabled === true ? 'hidden' : ''} absolute right-0`}>
                                            <FaCheck className="w-[27px] h-[27px]" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    )
}

export default DirectMessages;