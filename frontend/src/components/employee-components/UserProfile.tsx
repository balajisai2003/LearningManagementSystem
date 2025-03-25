"use client"
import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,

} from "@/components/ui/carousel"

import Autoplay from "embla-carousel-autoplay"
import { banner1, banner2, banner3 } from '@/assets'
import Image from 'next/image'
import Link from 'next/link'
import { useSessionStorage } from '@/hooks/useSessionStorage'
import { Badge } from '../ui/badge'


const CarouselConfiguration = [
    {
        image: banner3,
        link: 'https://www.winwire.com/'
    },
    {
        image: banner1,
        link: 'https://www.winwire.com/'
    },
    {
        image: banner2,
        link: 'https://www.winwire.com/'
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
    const userStr = useSessionStorage('user');
    const getInitials = (name: string) => {
        const names = name?.split(' ');
        const initials = `${names?.[0]?.charAt(0)} ${names?.[1]?.charAt(0)}`;
        return initials?.toUpperCase();
    };

    return (
        <div className='my-4 flex items-start space-x-4'>
            <div className=' bg-white card-style overflow-hidden' style={{ flex: 3 }}>
                <CarouselPlugin />
            </div>
            <div className="flex flex-col justify-center items-center text-center bg-white card-style   transition-shadow duration-300 h-[250px] p-4 space-y-3" style={{ flex: 1 }}>
                <div className="flex items-center justify-center w-[80px] h-[80px] rounded-full bg-gradient-to-r from-primary to-blue-600 text-white text-3xl font-bold shadow-md">
                    {getInitials(userStr?.name)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{userStr?.name}</h3>
                <p className="text-sm text-gray-800 font-medium">{userStr?.designation} <span className="text-xs text-gray-600">({userStr?.cadre})</span></p>
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                    <Badge >{userStr?.techGroup}</Badge>
                    <span>|</span>
                    <span className="text-gray-500">{userStr?.location}</span>
                </div>
            </div>
        </div>
    )
}

export default UserProfile