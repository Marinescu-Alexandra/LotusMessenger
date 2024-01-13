/* eslint-disable @next/next/no-img-element */
import React, { FC } from "react"
import Image from "next/image"

interface Dictionary<T> {
    [Key: string]: T;
}

interface RightChatBubble {
    className?: string,
    message: string,
    deliverTime: string,
    sent: boolean,
    seen: boolean,
    scrollRef: any
    imageUrl?: string[]
}

const RightChatBubble: FC<RightChatBubble> = ({ className, message, deliverTime, sent, seen, scrollRef, imageUrl }) => {

    return (
        <div ref={scrollRef} className="flex flex-col items-end gap-2.5 ml-4 mt-4 mb-4 justify-end mr-4">
            <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-l-xl rounded-b-xl rounded-es-xl dark:bg-gray-800">
                <p className="text-sm font-normal pb-2.5 text-gray-900 dark:text-white break-words">{message}</p>
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
                                        <button data-tooltip-target="download-image-1" className="inline-flex items-center justify-center rounded-full h-8 w-8 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50">
                                            <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3" />
                                            </svg>
                                        </button>
                                    </div>
                                    <img src={`/userImages/${url}`} alt="messageImage" className="rounded-lg object-cover w-[140px] h-[140px]" />
                                </div>
                            )
                        })}
                    </div>
                }
                <div className="flex flex-row w-full justify-between items-center">
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{deliverTime}</span>
                </div>
            </div>
        </div>
    )
}

export default RightChatBubble;