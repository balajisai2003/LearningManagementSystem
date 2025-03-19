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
import { Button } from '../ui/button';
import { Check, ChevronRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAppDispatch } from '@/redux/app/hooks';
import { toast } from 'sonner';


function CarouselSpacing({ videoItems, setVideoItems }: { videoItems: Course[], setVideoItems: React.Dispatch<SetStateAction<Course[]>> }) {
  const dispatch = useAppDispatch()
  const [loadingProgressId, setLoadingProgressId] = useState<number | null>(null);

  const handleCourseComplete = async (progressId: number) => {
    setLoadingProgressId(progressId);
    try {
      const url = `https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/CourseProgress/complete/${progressId}`;
      const response = await axios.post(url);

      if (response.status === 200) {
        const updatedVideoItems = videoItems.map((video) =>
          video.progressID === progressId ? { ...video, status: 'Completed' } : video
        ) as Course[];

        // Dispatch to Redux store (if you need all items, including completed)
        dispatch(addCourses(updatedVideoItems));

        // Filter out completed courses for display
        const filteredVideoItems = updatedVideoItems.filter(course =>
          course.status !== 'Completed'
        );

        setVideoItems(filteredVideoItems);
        toast.success("Course marked as complete successfully!");
      } else {
        console.error('Failed to mark course as complete:', response.statusText);
        toast.error("Failed to mark the course as complete. Please try again.");
      }
    } catch (error) {
      console.error('Error completing course:', error);
      toast.error("An error occurred while completing the course. Please try again later.");
    }
    finally {
      setLoadingProgressId(null);
    }
  };

  return (
    <Carousel className="w-[75vw]">
      <CarouselContent className="-ml-1">
        {videoItems.map((video, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/3 lg:basis-1/3">
            <div className="p-1 box-border">
              <div className="card-style w-full p-2 flex flex-col justify-between rounded-xl bg-white shadow-md border hover:shadow-lg transition-all duration-300 h-[250px]">
                <div className="font-semibold text-sm flex items-start space-x-2">
                  <h3 className='flex-1'>
                    {video.courseDetails.title}
                  </h3>
                  <div className={` flex justify-end items-center`}>
                    <p className={`text-xs font-medium px-4 py-1 shadow-md rounded-lg ${video.status === 'Completed'
                      ? 'bg-green-100 text-green-600'
                      : video.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-600'
                      }  font-semibold`}>{video.status}</p>
                  </div>
                </div>
                {video.courseDetails.description && (
                  <div>
                    <p className="text-sm text-gray-600 italic">
                      {video.courseDetails.description}
                    </p>
                  </div>
                )}

                <div className='w-full flex flex-col space-y-2'>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Duration: {video.courseDetails.durationInWeeks} weeks, {video.courseDetails.durationInHours} hours
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <a
                      href={video.courseDetails.resourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary/90 hover:bg-primary flex items-center space-x-2 text-center text-white text-sm px-4 py-2 rounded-md transition-all duration-300"
                    >
                      <span>Continue</span>
                      <ChevronRight size={20} />
                    </a>
                    <Button
                      onClick={() => handleCourseComplete(video.progressID)}
                      className='bg-green-600 hover:bg-green-700 flex items-center space-x-2'
                      disabled={loadingProgressId === video.progressID}
                    >
                      {loadingProgressId === video.progressID ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Complete</span>
                          <Check size={20} />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

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
  const [loading, setLoading] = useState(true); // Loader state
  const employeeId = 1001;

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch(`/api/employees?employeeId=${employeeId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();

        // Update the Redux store with employee details and courses
        dispatch(setEmpDetails({ empId: employeeId }));
        dispatch(addCourses(data.data.data));
        const filteredData = data.data.data
          .filter((course: Course) => course.status === 'In Progress' || course.status === 'Not Started')
          .sort((a: Course, b: Course) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        setVideoItems(filteredData);
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchCourseDetails();
  }, []);


  return (
    <div className='w-full card-style bg-white flex flex-col justify-center items-center py-4 space-y-2 my-2'>
      <div className='flex justify-start w-full px-4'>
        <h2 className='text-lg text-start font-semibold'>Your Courses</h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[250px]">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        videoItems && videoItems.length > 0 ? (
          <CarouselSpacing videoItems={videoItems} setVideoItems={setVideoItems} />
        ) :
          <p className="text-gray-500 min-h-[200px] flex justify-center items-center text-2xl">No courses available at the moment.</p>
      )}
      <div className='w-full flex justify-end px-4'>
        <Link href={EmployeeRoutes.LEARNINGS} className='underline'>See More</Link>
      </div>
    </div>
  )
}

export default VideoCarousel;
