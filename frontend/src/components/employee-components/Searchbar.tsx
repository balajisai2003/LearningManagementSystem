import React from 'react'
import { Bell, Mail, Search } from 'lucide-react'
const Searchbar = () => {
    return (
        <div className='bg-white card-style  w-full py-3 px-2 flex justify-between items-center'>
            <div className='rounded-full w-[50%] flex items-center justify-start h-10 p-2 border border-gray-400 bg-background cursor-pointer ml-8'>
                <Search className='text-gray-500 mr-2 p-0.5' />
                <input type='text' placeholder='Search for courses....' className='w-full h-10 outline-none bg-transparent text-foreground' />
            </div>
            <div className='flex items-center space-x-6 px-4'>
                <Mail className='text-gray-500 cursor-pointer' />
                <div className='relative'>
                    <Bell className='text-gray-500 cursor-pointer' />
                    <div className='w-1 h-1 bg-red-600 rounded-full absolute right-1.5 top-0 cursor-pointer' />
                </div>
            </div>
        </div>
    )
}

export default Searchbar