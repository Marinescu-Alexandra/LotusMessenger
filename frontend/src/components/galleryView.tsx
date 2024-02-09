import React, { FC, useEffect } from "react"
import Image from "next/image"
import { useState } from "react"
import close from '@/close.png'

interface GalleryViewProps {
    className?: string,
    mediaSelected: boolean,
    imagePaths: string[],
    index: number,
    handleGalleryClose: () => void
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
                <div className={`${mediaSelected ? 'flex' : 'hidden'} z-30 w-full h-full bg-bgMain ${className}`}>

                    <div className="flex flex-col justify-between items-center w-full h-full gap-20">
                        <button
                            className="pt-4 ml-auto mr-9"
                            onClick={() => handleGalleryClose()}>
                            <Image src={close} alt='profilePicturePlaceholder' width={20} height={20} priority />
                        </button>
                        <div className="w-[80%] min-h-[550px] max-h-[550px] flex items-center justify-center rounded-md">
                            <img src={`/userImages/${imagePaths[imageIndex]}`} alt="messageImage" className="object-contain h-full rounded-md"/>
                        </div>

                        <div className="flex justify-center items-center w-[90%] h-[120px] border-t-2 border-bgPrimary overflow-y-hidden">
                            <div className="grid grid-rows-1 grid-flow-col w-auto h-auto gap-5 mt-4 mb-6 overflow-x-auto no-scrollbar overflow-y-hidden">

                                {
                                    images.map((image: string, index) => {
                                        return (
                                            //add scroll ref on button
                                            <button key={index} onClick={() => setImageIndex(Number(index))} className={`w-[60px] h-[60px] max-h-[60px] max-w-[60px] flex items-center justify-center rounded-lg ${imageIndex === Number(index) ? 'border-2 border-green-500' : 'border border-bgPrimary'} `} id={String(index)}>
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