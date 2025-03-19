"use client"

import React, { useState, FC } from 'react'
import Searchbar from '@/components/employee-components/Searchbar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the Course interface
interface Course {
    title: string
    status: 'Completed' | 'In Progress' | 'Not Started' | 'Requested' | 'Pending Bulk Request'
    progress: number
    comment?: string
    redirectionLink: string
    duration: string
}

// Course Card Component with TS props
interface CourseCardProps {
    course: Course
}

const CourseCard: FC<CourseCardProps> = ({ course }) => {
    return (
        <div className="p-1 box-border">
            <div className="card-style w-full p-2 flex flex-col justify-between rounded-xl bg-white shadow-md border hover:shadow-lg transition-all duration-300 h-[250px]">
                <div className="font-semibold text-sm flex items-start space-x-2">
                    <h3 className="flex-1">
                        {course.title}
                    </h3>
                    <div className="flex justify-end items-center">
                        <p className={`text-xs font-medium px-4 py-1 shadow-md rounded-lg ${course.status === 'Completed'
                            ? 'bg-green-100 text-green-600'
                            : course.status === 'In Progress'
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-gray-100 text-gray-600'
                            } font-semibold`}>
                            {course.status}
                        </p>
                    </div>
                </div>
                {course.comment && (
                    <div>
                        <p className="text-sm text-gray-600 italic">{course.comment}</p>
                    </div>
                )}
                <div className="w-full flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                            {course.duration || "45 min"}
                        </span>
                    </div>
                    <a
                        href={course.redirectionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary/90 hover:bg-primary text-center text-white text-sm px-4 py-2 rounded-md transition-all duration-300"
                    >
                        Continue
                    </a>
                </div>
            </div>
        </div>
    )
}

// Sample data arrays for each view with explicit types
const mandatoryComplianceCourses: Course[] = [
    {
        title: "Safety Training 101",
        status: "Completed",
        progress: 100,
        comment: "Mandatory for all employees.",
        redirectionLink: "https://example.com/safety",
        duration: "30 min"
    },
    {
        title: "Data Protection & Privacy",
        status: "In Progress",
        progress: 50,
        comment: "Important for compliance.",
        redirectionLink: "https://example.com/dataprotection",
        duration: "45 min"
    },
    {
        title: "Workplace Ethics",
        status: "Not Started",
        progress: 0,
        comment: "",
        redirectionLink: "https://example.com/ethics",
        duration: "40 min"
    }
]

const yourCourses: Course[] = [
    {
        title: "Mastering React",
        status: "In Progress",
        progress: 70,
        comment: "Learning advanced hooks.",
        redirectionLink: "https://example.com/react",
        duration: "2h"
    },
    {
        title: "Advanced Node.js",
        status: "Completed",
        progress: 100,
        comment: "Great insights.",
        redirectionLink: "https://example.com/node",
        duration: "3h"
    },
    {
        title: "UI/UX Design Basics",
        status: "In Progress",
        progress: 40,
        comment: "Enhancing design skills.",
        redirectionLink: "https://example.com/uiux",
        duration: "1.5h"
    }
]

const requestedCourses: Course[] = [
    {
        title: "Cloud Computing Fundamentals",
        status: "Requested",
        progress: 0,
        comment: "Awaiting approval.",
        redirectionLink: "https://example.com/cloud",
        duration: "2h"
    },
    {
        title: "Cybersecurity Essentials",
        status: "Requested",
        progress: 0,
        comment: "Requested for team.",
        redirectionLink: "https://example.com/cyber",
        duration: "1h 30min"
    },
    {
        title: "DevOps Best Practices",
        status: "Requested",
        progress: 0,
        comment: "Scheduled for next month.",
        redirectionLink: "https://example.com/devops",
        duration: "2h 15min"
    }
]

const bulkRequests: Course[] = [
    {
        title: "Team Leadership Workshop",
        status: "Requested",
        progress: 0,
        comment: "Group training for managers.",
        redirectionLink: "https://example.com/leadership",
        duration: "4h"
    },
    {
        title: "Effective Communication",
        status: "Requested",
        progress: 0,
        comment: "Bulk request for department heads.",
        redirectionLink: "https://example.com/communication",
        duration: "2h 30min"
    }
]

// Main page component with filter tabs, search functionality, and status filter
const Page: FC = () => {
    const categories = [
        "Mandatory Compliance",
        "Your Courses",
        "Requested Courses",
        "Bulk Requests"
    ]
    const [selectedCategory, setSelectedCategory] = useState<string>(categories[0])
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [filterStatus, setFilterStatus] = useState<string>("All")

    // Retrieve courses based on the selected category
    const getCoursesForCategory = (): Course[] => {
        let courses: Course[] = []
        if (selectedCategory === "Mandatory Compliance") {
            courses = mandatoryComplianceCourses
        } else if (selectedCategory === "Your Courses") {
            courses = yourCourses
        } else if (selectedCategory === "Requested Courses") {
            courses = requestedCourses
        } else if (selectedCategory === "Bulk Requests") {
            courses = bulkRequests
        }
        // Filter courses by search query on title
        if (searchQuery.trim() !== "") {
            courses = courses.filter(course =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }
        // Filter courses by status if filterStatus is not "All"
        if (filterStatus !== "All") {
            courses = courses.filter(course => course.status === filterStatus)
        }
        return courses
    }

    const coursesToDisplay = getCoursesForCategory()

    return (
        <div className="p-4">
            {/* Searchbar and Filter Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                <Searchbar />
            </div>

            <div className='flex justify-between items-center'>
                {/* Category Tabs */}
                <div className="flex flex-wrap space-x-4 my-6">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 mb-2 ${selectedCategory === category
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <div className="w-[200px] bg-white rounded-lg border border-primary">
                    <Select
                        value={filterStatus}
                        onValueChange={(value) => setFilterStatus(value)}
                    >
                        <SelectTrigger className='border-none rounded-lg outline-none focus:outline-none'>
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {["All", "Completed", "In Progress", "Not Started", "Requested"].map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {/* View Header */}
            <section className="mb-4">
                <h2 className="text-2xl font-bold">
                    {selectedCategory}
                    <span className="text-base text-gray-500 ml-2">
                        ({coursesToDisplay.length})
                    </span>
                </h2>
            </section>

            {/* Course Cards Grid */}
            <section>
                {coursesToDisplay.length === 0 ? (
                    <p className="text-gray-500">No courses found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {coursesToDisplay.map((course, index) => (
                            <CourseCard course={course} key={index} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}

export default Page
