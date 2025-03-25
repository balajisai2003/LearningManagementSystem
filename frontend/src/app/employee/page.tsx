"use client"

import EventAndStats from '@/components/employee-components/EventAndStats'
import Searchbar from '@/components/employee-components/Searchbar'
import UserProfile from '@/components/employee-components/UserProfile'
import VideoCarousel from '@/components/employee-components/VideoCarousel'
import React, { useEffect, useState } from 'react'

const Employee = () => {
    const [mount, setMount] = useState(false);
    useEffect(() => {
        setMount(true);
    }, [])

    if (!mount) return null;
    return (
        <div>
            <Searchbar />
            <UserProfile />
            <EventAndStats />
            <VideoCarousel />
        </div>
    )
}

export default Employee