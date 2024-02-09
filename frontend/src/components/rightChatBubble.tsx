/* eslint-disable @next/next/no-img-element */
import React, { FC } from "react"
import Image from "next/image"
import seenIcon from '@/seen.png'
import delivered from '@/read.png'
import defaultStatus from '@/default.png'

interface RightChatBubble {
    className?: string,
    message: string,
    deliverTime: string,
    status: string
    imageUrl: string[],
    handleImageGalleryClick: (a: number, b: string[]) => void,
}

const RightChatBubble: FC<RightChatBubble> = ({ message, deliverTime, status, imageUrl, handleImageGalleryClick }) => {

    return (
        <>
            <div className="flex items-end gap-2.5 ml-4 mb-1.5 justify-end mr-4 z-20">
                <div className={`min-w-[30px] ${imageUrl && imageUrl.length <= 4 && imageUrl.length >= 1 ? 'max-w-[380px]' : 'max-w-[680px]'} relative leading-1.5 py-2 px-4 border-gray-200 bg-bgPrimary rounded-l-xl rounded-b-xl rounded-es-xl ${message.length <= 80 && imageUrl.length === 0 ? 'flex flex-row gap-2 !px-2.5 !py-1.5 !max-w-[810px]' : ''}`}>
                    <p className="text-normal font-normal text-textRightBubble break-words text-wrap">{message}</p>
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
                                if (index <= 2) {
                                    return (
                                        <button onClick={() => handleImageGalleryClick(index, imageUrl)} key={index}>
                                            <div className="group relative">
                                                <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                                </div>
                                                <img src={`/userImages/${imageUrl[index]}`} alt="messageImage" className="rounded-lg object-cover w-[240px] h-[240px]" />
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
                                                <img src={`/userImages/${imageUrl[index]}`} alt="messageImage" className="rounded-lg object-cover w-[240px] h-[240px]" />
                                            </div>
                                        </button>
                                    )
                                }
                            })}
                        </div>
                    }
                    <div className="flex flex-row justify-end items-center gap-1.5">
                        <span className="text-sm font-normal text-gray-400 text-center pt-[2px]">{deliverTime}</span>
                        {
                            status === 'seen' ?
                                <Image src={seenIcon} alt='readIcon' width={20} height={20} className="rounded-full" priority />
                                :
                                status === 'delivered' ?
                                    <Image src={delivered} alt='readIcon' width={20} height={20} className="rounded-full " priority />
                                    :
                                    <Image src={defaultStatus} alt='readIcon' width={20} height={20} className="rounded-full " priority />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default RightChatBubble;