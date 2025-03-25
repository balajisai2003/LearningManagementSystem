"use client"

import React, { useState, FC, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from '@/redux/app/hooks'
import { addCourses, Course, setEmpDetails } from '@/redux/features/employeeDataSlice'
import axiosInstance from '@/lib/axiosInstance'
import CoursesView, { CourseProgressCard } from '@/components/employee-components/CoursesView'

import RequestedCoursesView from '@/components/employee-components/RequestedCoursesView'
import CardSkimmer from '@/components/CardSkimmer'
import BrownBagRequests from '@/components/employee-components/BrownBagRequests'



const Page: FC = () => {
    const categories = ["Mandatory Compliance", "Your Courses", "Requested Courses", "Brown Bag Requests"]
    const [selectedCategory, setSelectedCategory] = useState<string>(categories[0])
    const [filterStatus, setFilterStatus] = useState<string>("All")
    const dispatch = useAppDispatch();
    const [mandaryCourses, setMandatoryCourses] = useState<Course[]>([])
    const { courses: reduxSavedCourses } = useAppSelector((state) => state.employeeDataSlice)

    const [loading, setLoading] = useState(false)

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
                }
            } catch (error) {
                console.error("Error fetching course details:", error)
            } finally {
                setLoading(false)
            }
        }
        if (mandaryCourses.length === 0) {
            fetchCourseDetails()
        } else {
            setMandatoryCourses(reduxSavedCourses)
        }
    }, [dispatch])

    const getCoursesForCategory = (): Course[] => {
        let filteredCourses: any[] = reduxSavedCourses
        // Filter by category
        if (selectedCategory === "Mandatory Compliance") {
            filteredCourses = reduxSavedCourses.filter(course =>
                course.courseDetails.category === "Mandatory trainings"
            )
        }
        return filteredCourses
    }

    const coursesToDisplay = getCoursesForCategory()

    // Helper function to translate API status to display status
    const getDisplayStatus = (status: Course['status']) => {
        const statusMap = {
            'Completed': 'Completed',
            'In Progress': 'In Progress',
            'Not Started': 'Not Started',
            'Requested': 'Requested',
            'Pending Bulk Request': 'Pending Approval'
        }
        return statusMap[status as keyof typeof statusMap] || status
    }

    return (
        <div className="p-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                <div className="w-[200px] bg-white rounded-lg border border-primary">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className='border-none rounded-lg'>
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {["All", "Completed", "In Progress", "Not Started", "Requested"].map((status) => (
                                <SelectItem key={status} value={status}>
                                    {getDisplayStatus(status as Course['status'])}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-4 my-6">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${selectedCategory === category
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Course Grid */}
            <section>
                {
                    selectedCategory === "Mandatory Compliance" && (
                        <>
                            <h2 className="text-2xl font-bold mb-4">
                                {selectedCategory}
                                <span className="text-base text-gray-500 ml-2">
                                    ({coursesToDisplay.length})
                                </span>
                            </h2>

                            {loading ? <CardSkimmer /> : coursesToDisplay.length > 0 && coursesToDisplay.map((course, key) => (
                                <div className='grid grid-cols-2 gap-4' key={key}>
                                    <CourseProgressCard data={course} />
                                </div>
                            ))}

                        </>
                    )
                }

                {
                    selectedCategory === "Your Courses" && (
                        <CoursesView selectedCategory={selectedCategory} />
                    )
                }

                {
                    selectedCategory === "Requested Courses" && (
                        <RequestedCoursesView selectedCategory={selectedCategory} />
                    )
                }

                {
                    selectedCategory === "Brown Bag Requests" && (
                        <BrownBagRequests selectedCategory={selectedCategory} />
                    )
                }
            </section>
        </div>
    )
}

export default Page