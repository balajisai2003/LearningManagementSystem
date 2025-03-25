"use client"
import React, { SetStateAction, useEffect, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import Link from 'next/link';
import { EmployeeRoutes } from '@/lib/EmployeeRoutes';
import { useDispatch } from 'react-redux';
import { setEmpDetails, addCourses, Course } from '@/redux/features/employeeDataSlice';
import axiosInstance from '@/lib/axiosInstance';
import { CourseProgressCard } from './CoursesView';
import { Status } from '@/types/Status';


function CarouselSpacing({ videoItems, setVideoItems }: { videoItems: Course[], setVideoItems: React.Dispatch<SetStateAction<Course[]>> }) {

  return (
    <Carousel className="w-[75vw]">
      <CarouselContent className="-ml-1">
        {videoItems.map((video, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/2">
            <CourseProgressCard data={video} setVideoItems={setVideoItems} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

const VideoCarousel = () => {
  const [videoItems, setVideoItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const userStr = JSON.parse(sessionStorage.getItem('user') || '{}');
        dispatch(setEmpDetails(userStr));
        const response = await axiosInstance.get(
          `https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/CourseProgress/employee/${userStr?.employeeID}`
        );

        if (response.data) {
          dispatch(addCourses(response.data.data));
          const filteredData = response.data.data
            .filter((course: Course) => course.status === Status.Started || course.status === Status.NotStarted)
            .sort((a: Course, b: Course) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
          setVideoItems(filteredData);
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if window is available (client-side)
    if (typeof window !== 'undefined') {
      fetchCourseDetails();
    }
  }, [dispatch]);

  return (
    <div className='w-full card-style bg-white flex flex-col justify-center items-center py-4 space-y-2 my-4'>
      <div className='flex justify-start w-full px-4'>
        <h2 className='text-lg text-start font-semibold'>Courses You Are Currently Enrolled In</h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[250px]">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        videoItems && videoItems.length > 0 ? (
          <CarouselSpacing videoItems={videoItems} setVideoItems={setVideoItems} />
        ) : (
          <p className="text-gray-500 min-h-[200px] flex justify-center items-center text-2xl">
            No courses available at the moment.
          </p>
        )
      )}
      <div className='w-full flex justify-end px-4'>
        <Link href={EmployeeRoutes.LEARNINGS} className='underline'>See More</Link>
      </div>
    </div>
  );
};

export default VideoCarousel;
