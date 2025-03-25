import axiosInstance from '@/lib/axiosInstance'
import { useAppDispatch, useAppSelector } from '@/redux/app/hooks'
import { addCourses, Course, setEmpDetails } from '@/redux/features/employeeDataSlice'
import React, { SetStateAction, useEffect, useState } from 'react'
import CardSkimmer from '../CardSkimmer'

import {
  Trophy,
  CalendarDays,
  BookOpen,
  PlayCircle,
  ArrowUpRight,

  Shield,
  Clock,
  Award,
  CheckCircle
} from 'lucide-react';
import { Status } from '@/types/Status'
import { Button } from '../ui/button'

export const CourseProgressCard = ({ data, setVideoItems }: { data: any, setVideoItems?: React.Dispatch<SetStateAction<Course[]>> }) => {
  const { status, courseDetails } = data;
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useAppDispatch()
  const { courses } = useAppSelector((state) => state.employeeDataSlice)

  const updateStatus = async (status: string) => {
    try {
      setIsUpdating(true);
      const payload = {
        progressID: data.progressID,
        employeeID: data.employeeDetails.employeeID,
        courseID: data.courseDetails.courseID,
        requestorEmployeeId: data.requestorEmployeeId,
        status: status,
        lastUpdated: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: null,
        newOrReUsed: data.newOrReUsed,
        monthCompleted: null,
      };

      await axiosInstance.put(
        `https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/CourseProgress/update/${data.progressID}`,
        payload
      );

      console.log("Status updated successfully");
      const updatedVideoItems = courses.map((video) =>
        video.progressID === data?.progressID ? { ...video, status: status } : video
      ) as Course[];
      dispatch(addCourses(updatedVideoItems));
      const filteredVideoItems = updatedVideoItems.filter(course =>
        course.status !== Status.Completed
      );
      if (setVideoItems) {
        setVideoItems(filteredVideoItems)
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="group relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-200">
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status === "Completed" ? "bg-green-50 text-green-700" :
          status === Status.Started ? "bg-orange-50 text-orange-700" :
            "bg-rose-50 text-rose-700"
          }`}>
          {status === Status.Started && <Clock className="h-3 w-3" />}
          {status === "Completed" && <Award className="h-3 w-3" />}
          {status}
        </div>
      </div>

      {/* Course Header */}
      <div className="flex flex-col space-y-3 mb-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {courseDetails.title}
          </h3>
        </div>

      </div>

      {/* Course Description */}
      <p className="text-gray-600 text-sm mb-5 line-clamp-2">
        {courseDetails.description}
      </p>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <CalendarDays className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Duration</p>
            <p className="text-sm font-medium">
              {courseDetails.durationInWeeks} weeks • {courseDetails.durationInHours} hrs
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="bg-purple-50 p-2 rounded-lg">
            <Shield className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Category</p>
            <p className="text-sm font-medium">{courseDetails.category}</p>
          </div>
        </div>
      </div>

      {/* Points and Skills */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
          <Trophy className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-medium text-blue-700">
            {courseDetails.points} Learning Points
          </span>
        </div>

        <div className="text-xs text-gray-500 flex items-center">
          <BookOpen className="h-3 w-3 mr-1" />
          {courseDetails.trainingMode}
        </div>
      </div>


      {/* Action Buttons */}
      <div className="flex space-x-3">
        {status === Status.NotStarted ? (
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm font-medium transition-colors" onClick={() => updateStatus(Status.Started)}>
            <PlayCircle className="h-4 w-4 mr-2" />
            {isUpdating ? "Updating..." : "Start Course"}
          </button>
        ) : status === Status.Started ? (
          <div className='flex items-center justify-between w-full'>
            <a
              href={courseDetails.resourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className=" bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm font-medium transition-colors"
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Continue
            </a>
            <Button onClick={() => updateStatus(Status.Completed)} className='bg-blue-500 text-white hover:bg-blue-600'>
              <CheckCircle className="h-4 w-4 mr-2" />
              {
                isUpdating ? "Updating..." : "Complete"
              }
            </Button>
          </div>
        ) : null}

      </div>
    </div>
  );
};


const CoursesView = ({ selectedCategory }: { selectedCategory: string }) => {
  const { courses } = useAppSelector((state) => state.employeeDataSlice)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [coursedData, setCourses] = useState<Course[]>([])
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true)
        const userStr = JSON.parse(sessionStorage.getItem('user') || '{}')
        dispatch(setEmpDetails(userStr))
        const response = await axiosInstance.get(
          `https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/CourseProgress/employee/${userStr?.employeeID}`
        )
        if (response.data) {
          dispatch(addCourses(response.data.data))
          setCourses(response.data.data)
        }
      } catch (error) {
        console.error("Error fetching course details:", error)
      } finally {
        setLoading(false)
      }
    }
    if (courses.length > 0) {
      setCourses([...courses])
    } else {
      fetchCourseDetails()
    }
  }, [dispatch])



  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {selectedCategory}
        <span className="text-base text-gray-500 ml-2">
          ({coursedData.length})
        </span>
      </h2>
      {
        loading ? <CardSkimmer /> : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
          {
            coursedData.map((course, key) =>
              <CourseProgressCard key={key} data={course} />
            )
          }
        </div>
      }

    </div>
  )
}

export default CoursesView