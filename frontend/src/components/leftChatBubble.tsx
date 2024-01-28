/* eslint-disable @next/next/no-img-element */
import React, { FC } from "react"
import Image from "next/image"
import profilePlaceholder from '@/profilePicturePlaceholder.png'

interface LeftChatBubble {
    className?: string,
    message: string,
    deliverTime: string,
    scrollRef: any
    imageUrl: string[]
    handleImageGalleryClick: (a: number, b: string[]) => void,
    userProfileImage?: string
}

const LeftChatBubble: FC<LeftChatBubble> = ({ className, message, deliverTime, scrollRef, imageUrl, handleImageGalleryClick, userProfileImage }) => {
    return (
        <div className="flex items-start gap-2.5 ml-4 mt-4 mb-4 z-20">
            {
                userProfileImage ?
                    <img
                        src={`/userProfileImages/${userProfileImage}`}
                        alt="profilePicturePlaceholder"
                        className="rounded-full w-10 h-10" />
                    :
                    <Image className="w-8 h-8 rounded-full" src={profilePlaceholder} alt="profilePicPlaceholder" />
            }
            

            <div className={`min-w-[30px] ${imageUrl && imageUrl.length <= 4 ? 'max-w-[380px]' : 'max-w-[580px]'}  leading-1.5 p-4 border-gray-200 bg-bgPrimary rounded-r-xl rounded-b-xl rounded-es-xl`}>
                <p className="text-normal font-normal pb-2.5 text-textLeftBubble break-words">{message}</p>
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
                        {/* Aici ar trb un for cu break in loc de map, dar nu stiu dc nu merge for ul :) */}
                        {imageUrl.map((url, index) => {
                            if (index <= 2) {
                                return (
                                    <button onClick={() => handleImageGalleryClick(index, imageUrl)} key={index}>
                                        <div className="group relative">
                                            <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                            </div>
                                            <img src={`/userImages/${url}`} alt="messageImage" className="rounded-lg object-cover w-[240px] h-[240px]" />
                                        </div>
                                    </button>

                                )
                            } else if (index === 3) {
                                return (
                                    <button onClick={() => handleImageGalleryClick(index, imageUrl)} key={index}>
                                        <div className="group relative">
                                            <div className="absolute w-full h-full bg-gray-900/90 hover:bg-gray-900/50 transition-all duration-300 rounded-lg flex items-center justify-center">
                                                <span className="text-3xl font-medium text-white">+{imageUrl.length - 4}</span>
                                            </div>
                                            <img src={`/userImages/${url}`} alt="messageImage" className="rounded-lg object-cover w-[240px] h-[240px]" />
                                        </div>
                                    </button>
                                )
                            }
                        })}
                    </div>
                }
                <div ref={scrollRef} className="flex flex-row justify-start items-center">
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{deliverTime}</span>
                </div>
            </div>
        </div>
    )
}

export default LeftChatBubble;