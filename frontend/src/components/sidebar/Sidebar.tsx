"use client"

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MenuItem } from '@/types/MenuItem';
import { LogOut } from 'lucide-react';

const Sidebar = ({ children, menuItems }: { children: React.ReactNode, menuItems: MenuItem[] }) => {
    const router = useRouter();
    const pathname = usePathname(); // ✅ current path

    const handleClick = (route: string) => {
        router.push(route);
    };

    const handleLogout = () => {
        document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        sessionStorage.clear();
        router.push('/');
    };

    return (
        <div className="flex min-h-screen">
            <div className={`fixed top-0 left-0 h-full bg-white text-black p-5 transition-all duration-300 w-64`}>
                <div className="flex justify-between items-center mb-6">
                    <h1 className='text-3xl font-bold'>
                        <span className='text-[#0e4b8d]'>Win</span>
                        <span className='text-[#d04627]'>Learn</span>
                    </h1>
                </div>
                <ul className="space-y-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.route; // ✅ current route match
                        return (
                            <li key={item.name} className="group">
                                <button
                                    onClick={() => handleClick(item.route)}
                                    className={`
                                        flex w-full items-center space-x-3 text-sm p-2 rounded-md transition-colors duration-300
                                        ${isActive
                                            ? 'bg-primary text-background'
                                            : 'hover:text-background group-hover:bg-primary'
                                        }
                                    `}
                                >
                                    <span className="text-2xl">{item.icon}</span>
                                    <span>{item.name}</span>
                                </button>
                            </li>
                        );
                    })}

                    <li className="group">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center space-x-3 text-sm hover:text-background p-2 rounded-md group-hover:bg-primary"
                        >
                            <span className="text-2xl"><LogOut size={24} /></span>
                            <span>Log Out</span>
                        </button>
                    </li>

                </ul>
            </div>

            <div className="flex-1 p-5 ml-64 mb-6">{children}</div>
        </div>
    );
};

export default Sidebar;
