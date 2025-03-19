import EventAndStats from '@/components/employee-components/EventAndStats'
import Searchbar from '@/components/employee-components/Searchbar'
import UserProfile from '@/components/employee-components/UserProfile'
import VideoCarousel from '@/components/employee-components/VideoCarousel'
import React from 'react'

const Employee = () => {
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