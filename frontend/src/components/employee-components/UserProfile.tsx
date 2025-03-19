"use client"
import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,

} from "@/components/ui/carousel"

import Autoplay from "embla-carousel-autoplay"
import { banner1, banner2, banner3, profile } from '@/assets'
import Image from 'next/image'
import Link from 'next/link'


const CarouselConfiguration = [
    {
        image: banner3,
        link: 'https://www.google.com'
    },
    {
        image: banner1,
        link: 'https://www.google.com'
    },
    {
        image: banner2,
        link: 'https://www.google.com'
    }
]

function CarouselPlugin() {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false })
    )

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full overflow-hidden"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={() => plugin.current.play(false)}
            opts={{
                align: "start",
                loop: true,
            }}
        >
            <CarouselContent className='h-[250px]'>
                {CarouselConfiguration.map((item, index) => (
                    <CarouselItem key={index} className='w-full h-full'>
                        <Link href={item.link} target='_blank' className="w-full h-full rounded-md relative">
                            <Image src={item.image} alt='banner' width={500} height={500} className='h-full w-full object-cover' />
                        </Link >
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>

    )
}


const UserProfile = () => {
    return (
        <div className='my-4 flex items-start space-x-4'>
            <div className=' bg-white card-style overflow-hidden' style={{ flex: 3 }}>
                <CarouselPlugin />
            </div>
            <div className='bg-white py-2 card-style flex flex-col justify-center items-center text-center rounded-lg shadow-md h-[250px] space-y-2' style={{ flex: 1 }}>
                <Image src={profile} width={100} height={100} alt='profile' className='mt-3 w-[100px] h-[100px] object-cover border-4 border-primary rounded-full' />
                <h3 className=' text-xl font-semibold text-black p-1'>Shoyeab Aslam</h3>
                <h4 className=' text-sm font-light text-gray-800'>Software Design Trainee</h4>
            </div>
        </div>
    )
}

export default UserProfile