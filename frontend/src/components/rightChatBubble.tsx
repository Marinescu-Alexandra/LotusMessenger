/* eslint-disable @next/next/no-img-element */
import React, { FC, useState } from "react"
import Image from "next/image"
import seenIcon from '@/seen.png'
import delivered from '@/read.png'
import defaultStatus from '@/default.png'
import GalleryView from "./galleryView"

interface Dictionary<T> {
    [Key: string]: T;
}

interface RightChatBubble {
    className?: string,
    message: string,
    deliverTime: string,
    status: string
    scrollRef: any
    imageUrl: string[],
    handleImageGalleryClick: any
}

const RightChatBubble: FC<RightChatBubble> = ({ className, message, deliverTime, status, scrollRef, imageUrl, handleImageGalleryClick }) => {

    return (
        <>
            <div ref={scrollRef} className="flex flex-row items-end gap-2.5 ml-4 mt-4 mb-4 justify-end mr-4 z-20">
            <div className="min-w-[30px] max-w-[580px] leading-1.5 p-4 border-gray-200 bg-darkBgPrimary rounded-l-xl rounded-b-xl rounded-es-xl">
                <p className="text-normal font-normal pb-2.5 text-textRightBubble break-words text-wrap">{message}</p>
                {
                    (imageUrl && imageUrl.length === 1) &&
                    <div className="group relative my-2.5">
                        <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                    <button
                                        data-tooltip-target="download-image"
                                        className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-white/30 hover:bg-white/50 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50">
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
                                {imageUrl.map((url, index) => {
                            return (
                                <button onClick={() => handleImageGalleryClick(index, imageUrl)} key={index}>
                                    <div className="group relative">
                                        <div className="absolute w-full h-full bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">

                                        </div>
                                        <button


                                        >
                                            <img src={`/userImages/${url}`} alt="messageImage" className="rounded-lg object-cover w-[140px] h-[140px]" />
                                        </button>

                                    </div>
                                </button>

                            )
                        })}
                    </div>
                }
                <div className="flex flex-row justify-end items-center gap-2 ml-4">
                    <span className="text-sm font-normal text-gray-400">{deliverTime}</span>
                    {
                        status === 'seen' ?
                            <Image src={seenIcon} alt='readIcon' width={25} height={25} className="rounded-full" priority />
                            :
                            status === 'delivered' ?
                                <Image src={delivered} alt='readIcon' width={25} height={25} className="rounded-full" priority />
                                :
                                <Image src={defaultStatus} alt='readIcon' width={25} height={25} className="rounded-full" priority />
                                                             
                    }
                    
                </div>
                
            </div>
            
            
            
            </div>
        </>
    )
}

export default RightChatBubble;