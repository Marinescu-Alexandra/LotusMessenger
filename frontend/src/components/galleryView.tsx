import React, { FC, useEffect } from "react"
import Image from "next/image"
import { useState } from "react"
import close from '@/close.png'

interface GalleryViewProps {
    className?: string,
    mediaSelected: boolean,
    imagePaths: string[],
    index: number,
    handleGalleryClose: any
}

const GalleryView: FC<GalleryViewProps> = ({ className, mediaSelected, imagePaths, index, handleGalleryClose }) => {
    const [imageIndex, setImageIndex] = useState(index)
    const [images, setImages] = useState<string[]>(imagePaths)

    useEffect(() => {
        setImageIndex(index)
        setImages(imagePaths)
    }, [index, imagePaths])

    if (imagePaths.length > 0) {
        return (
            <>
                <div className={`${mediaSelected ? 'flex' : 'hidden'} z-30 w-full h-full bg-darkBgMain overflow-y-scroll no-scrollbar ${className}`}>

                    <div className="flex flex-col justify-between items-center w-full min-h-[800px] gap-10">
                        <button
                            className="mt-4 mr-auto ml-4"
                            onClick={() => handleGalleryClose()}>
                            <Image src={close} alt='profilePicturePlaceholder' width={20} height={20} priority />
                        </button>
                        <div className="w-[680px] h-[580px] flex items-center justify-center">
                            <img src={`/userImages/${imagePaths[imageIndex]}`} alt="messageImage" className="object-contain w-full h-full" />
                        </div>

                        <div className="flex flex-row w-[90%] justify-between items-start h-[120px] border-t-2 border-darkBgPrimary ">
                            <div className="flex flex-row w-full justify-center items-center h-auto gap-5 mt-4  overflow-y-scroll no-scrollbar">

                                {
                                    images.map((image: string, index: React.Key | null | undefined) => {
                                        return (
                                            <button onClick={() => setImageIndex(Number(index))} className={`w-[60px] h-[60px] flex items-center justify-center rounded-lg ${imageIndex === Number(index) ? 'border-2 border-green-500' : 'border border-black'} `} id={String(index)}>
                                                <img src={`/userImages/${image}`} alt="messageImage" className="object-cover w-full h-full rounded-lg" />
                                            </button>
                                        )

                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default GalleryView;