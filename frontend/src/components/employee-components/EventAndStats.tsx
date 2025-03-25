"use client";
import { Smile, SquareMousePointer } from 'lucide-react';
import React from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { event } from '@/assets';
import Image from 'next/image';
import Link from 'next/link';
import PointsCard from './PointsCard';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from '@/redux/app/store';
import { Status } from '@/types/Status';

const events = [
    {
        id: 1,
        title: "Event 1",
        startDate: "March 1, 2025",
        endDate: "March 31, 2025",
        registerUrl: "/path/to/event1.jpg",
    },
    {
        id: 2,
        title: "Event 2",
        startDate: "April 5, 2025",
        endDate: "April 20, 2025",
        registerUrl: "/path/to/event2.jpg",
    },
    {
        id: 3,
        title: "Event 3",
        startDate: "May 10, 2025",
        endDate: "May 20, 2025",
        registerUrl: "/path/to/event3.jpg",
    },
    {
        id: 4,
        title: "Event 4",
        startDate: "June 1, 2025",
        endDate: "June 15, 2025",
        registerUrl: "/path/to/event4.jpg",
    },
];


const EventAndStats = () => {
    const courses = useSelector((state: RootState) => state?.employeeDataSlice?.courses);
    const [statusData, setStatusData] = useState({
        labels: ["Completed", "In Progress", "Not Started"],
        datasets: [
            {
                data: [1, 1, 1], // Default values
                backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
                hoverBackgroundColor: ["#45A049", "#FFB300", "#E53935"],
            },
        ],
    });

    useEffect(() => {
        if (courses.length > 0) {
            const completed = courses.filter(course => course.status === Status.Completed).length;
            const inProgress = courses.filter(course => course.status === Status.Started).length;
            const notStarted = courses.filter(course => course.status === Status.NotStarted).length;

            setStatusData({
                labels: ["Completed", "In Progress", "Not Started"],
                datasets: [
                    {
                        data: [completed, inProgress, notStarted],
                        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
                        hoverBackgroundColor: ["#45A049", "#FFB300", "#E53935"],
                    },
                ],
            });
        }
    }, [courses]);
    return (
        <div className="flex space-x-4">
            <div className='bg-white card-style grow-[6] basis-0 p-4'>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Upcoming Learnings, Events and Certifications</h2>
                <div className=' w-full flex flex-col space-y-3  overflow-y-scroll h-[220px] pr-6 custom-scrollbar'>
                    {
                        events.length > 0 ? events.map((e, index) => (
                            <div key={index} className='flex space-x-2 shadow-lg border rounded-lg p-2'>
                                <div className='flex-1 flex space-x-2 px-2'>
                                    <Image src={event} width={500} height={500} alt='event' className='w-[40px] h-[40px] cursor-pointer' />
                                    <div>
                                        <p className='font-semibold text-md truncate'>{e.title}</p>
                                        <p className='font-normal text-xs'>{`${e.startDate} - ${e.endDate}`}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col justify-center items-center space-y-2'>
                                    <Link href={e.registerUrl} target='_blank' className='flex items-center space-x-2 border rounded-sm py-1 px-2 shadow-sm border-blue-500 text-blue-500 bg-blue-50 text-xs'>
                                        <span>Visit Resource</span><SquareMousePointer size={15} className='cursor-pointer' />
                                    </Link>
                                </div>
                            </div>
                        )) :
                            <div className='h-full w-full flex flex-col space-y-2 justify-center items-center'>
                                <p>
                                    No Events at the Moment, But Keep an Eye Out!
                                </p>
                                <Smile size={40} className='text-gray-700' />
                            </div>
                    }

                </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-xl p-4 card-style transition-shadow grow-[2] basis-0">
                <h2 className="text-lg font-semibold text-gray-800 mb-6"> Completion Status</h2>

                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="h-48">
                        <Pie
                            data={statusData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: "bottom",
                                        labels: {
                                            boxWidth: 12,
                                            padding: 16,
                                            font: { size: 12 },
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>


            <div className='bg-white card-style grow-[2] basis-0 p-4'>
                <PointsCard />
            </div>
        </div>
    );
};

export default EventAndStats;


