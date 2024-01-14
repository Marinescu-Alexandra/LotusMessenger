/* eslint-disable @next/next/no-img-element */
import React, { FC } from "react"
import Image from "next/image"
import profilePlaceholder from '@/profilePicturePlaceholder.png'
import seenIcon from '@/seen.png'

interface Dictionary<T> {
    [Key: string]: T;
}

interface LeftChatBubble {
    className?: string,
    message: string,
    deliverTime: string,
    scrollRef: any
    imageUrl?: string[]
    status: string
}

const LeftChatBubble: FC<LeftChatBubble> = ({ className, message, deliverTime, scrollRef, imageUrl, status }) => {
    return (
        <div ref={scrollRef} className="flex items-start gap-2.5 ml-4 mt-4 mb-4 z-20">
            <Image className="w-8 h-8 rounded-full" src={profilePlaceholder} alt="profilePicPlaceholder" />
            
            <div className="flex flex-col min-w-[30px] max-w-[580px] leading-1.5 p-4 border-gray-200 bg-darkBgPrimary rounded-e-xl rounded-es-xl">
                <p className="text-normal font-normal pb-2.5 text-textLeftBubble break-words">{message}</p>
                {
                    (imageUrl && imageUrl.length === 1) &&
                    <div className="group relative my-2.5">
                        <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                            <button data-tooltip-target="download-image" className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50">
                                <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3" />
                                </svg>
                            </button>
                        </div>
                        <img src={`/userImages/${imageUrl[0]}`} alt="messageImage" className="rounded-lg" />
                    </div>
                }
                {
                    (imageUrl && imageUrl.length > 1) &&
                    <div className="grid gap-4 grid-cols-2 my-2.5">
                        {imageUrl.map((url) => {
                            return (
                                <div className="group relative">
                                    <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                        <button data-tooltip-target="download-image" className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50">
                                            <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3" />
                                            </svg>
                                        </button>
                                    </div>
                                    <img src={`/userImages/${url}`} alt="messageImage" className="rounded-lg w-[50px] h-[50px]" />
                                </div>
                            )
                        })}
                    </div>
                }
                <div className="flex flex-row justify-start items-center">
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{deliverTime}</span>
                </div>
            </div>
        </div>
    )
}

export default LeftChatBubble;