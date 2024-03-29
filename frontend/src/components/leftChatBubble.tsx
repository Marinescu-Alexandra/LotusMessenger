/* eslint-disable @next/next/no-img-element */
import React, { FC } from "react"
import Image from "next/image"
import profilePlaceholder from '@/profilePicturePlaceholder.png'

interface LeftChatBubble {
    className?: string,
    message: string,
    deliverTime: string,
    imageUrl: string[]
    handleImageGalleryClick: (a: number, b: string[]) => void,
    userProfileImage?: string,
    displayProfileImage?: boolean,
}

const LeftChatBubble: FC<LeftChatBubble> = ({ message, deliverTime, imageUrl, handleImageGalleryClick, userProfileImage, displayProfileImage }) => {

    return (
        <div className="flex items-start gap-2.5 ml-4 mb-1.5 z-20">
            {
                displayProfileImage ?
                    userProfileImage ?
                        <img
                            src={`/userProfileImages/${userProfileImage}`}
                            alt="profilePicturePlaceholder"
                            className="rounded-full w-10 h-10 object-cover" />
                        :
                        <Image className="w-10 h-10 rounded-full object-cover" src={profilePlaceholder} alt="profilePicPlaceholder" />
                    :
                    <span className="w-10"></span>
            }
            

            <div className={`min-w-[30px] ${imageUrl && imageUrl.length <= 4 && imageUrl.length >= 1 ? 'max-w-[380px]' : 'max-w-[680px]'}  leading-1.5 py-2 px-4 border-gray-200 bg-bgPrimary rounded-r-xl rounded-b-xl rounded-es-xl ${message.length <= 80 && imageUrl.length === 0 ? 'flex flex-row gap-2 !px-2.5 !py-1.5 !max-w-[810px]' : ''} ${displayProfileImage ? 'mb-[4px]' : ''}`}>
                <p className="text-normal font-normal text-textLeftBubble break-words break-all">{message}</p>
                {
                    (imageUrl && imageUrl.length <= 4) &&

                    imageUrl.map((url, index) => {
                        return (
                            <button onClick={() => handleImageGalleryClick(index, imageUrl)} key={index} className="">
                                <div className="group relative my-2.5" key={index}>
                                    <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center" />
                                    <img src={`/userImages/${url}`} alt="messageImage" className="rounded-lg w-[350px] h-[400px] object-cover" />
                                </div>
                            </button>
                        )
                    })
                }
                {
                    (imageUrl && imageUrl.length > 4) &&
                    <div className="grid gap-4 grid-cols-2 my-2.5">
                            {[...Array(4)].map((item, index) => {
                            return (
                                <button onClick={() => handleImageGalleryClick(index, imageUrl)} key={index}>
                                    <div className="group relative">
                                        {
                                            index <= 2 ?
                                                <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center" />
                                            :
                                                <div className="absolute w-full h-full bg-gray-900/90 hover:bg-gray-900/50 transition-all duration-300 rounded-lg flex items-center justify-center">
                                                    <span className="text-3xl font-medium text-white">+{imageUrl.length - 4}</span>
                                                </div>
                                        }
                                        <img src={`/userImages/${imageUrl[index]}`} alt="messageImage" className="rounded-lg object-cover w-[240px] h-[240px]" />
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                }
                <div className="flex flex-row justify-end items-center">
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400 text-center pt-[3px]">{deliverTime}</span>
                </div>
            </div>
        </div>
    )
}

export default LeftChatBubble;