"use client"
import { useEffect, useState } from 'react'
import axiosInstance from '@/lib/axiosInstance'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, AlertCircle, ExternalLink } from 'lucide-react'

interface Course {
    courseID: number
    title: string
    resourceLink: string
    description: string
    category: string
    trainingMode: string
    trainingSource: string
    durationInWeeks: number
    durationInHours: number
    price: number | null
    skills: string
    points: number
}
const CourseCard = ({ course }: { course: Course }) => {
    return (
        <Card className="p-6 hover:shadow-md transition-shadow h-full flex flex-col">
            <div className="flex-grow space-y-4">
                {/* Header with title and points */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold leading-tight line-clamp-2">
                        {course.title}
                    </h3>
                    <Badge variant="secondary" className="shrink-0">
                        {course.points} pts
                    </Badge>
                </div>

                {/* Metadata row */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="bg-gray-100 px-2 py-1 rounded-md">
                        {course.category}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded-md">
                        {course.trainingMode}
                    </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-3">
                    {course.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                    {course.skills.split(', ').map((skill, i) => (
                        <Badge
                            key={i}
                            variant="outline"
                            className="text-xs font-normal"
                        >
                            {skill.trim()}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Footer with duration and CTA */}
            <div className="mt-6 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="font-medium">
                            {course.durationInWeeks} weeks ({course.durationInHours} hrs)
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-gray-500">Source</p>
                        <p className="font-medium truncate">{course.trainingSource}</p>
                    </div>
                </div>

                <Button className="w-full mt-2" size="sm" asChild>
                    <a
                        href={course.resourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                    >
                        <ExternalLink className="h-4 w-4" />
                        View Course
                    </a>
                </Button>
            </div>
        </Card>
    )
}

const CoursesPage = () => {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedTrainingMode, setSelectedTrainingMode] = useState('all')

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axiosInstance.get(
                    'https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/Courses/AllCourses'
                )
                setCourses(response.data.data)
            } catch {
                setError('Failed to fetch courses')
            } finally {
                setLoading(false)
            }
        }
        fetchCourses()
    }, [])

    const filteredCourses = Array.isArray(courses) && courses.length > 0 ? courses.filter(course => {
        const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
        const matchesMode = selectedTrainingMode === 'all' || course.trainingMode === selectedTrainingMode
        return matchesSearch && matchesCategory && matchesMode
    }) : []

    const categories = Array.isArray(courses) && courses.length > 0
        ? [...new Set(courses.map(course => course.category))]
        : []

    const trainingModes = Array.isArray(courses) && courses.length > 0
        ? [...new Set(courses.map(course => course.trainingMode))]
        : []

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <p className="text-xl text-gray-600">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Training Catalog</h1>

            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search courses..."
                        className="pl-10 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                    <SelectTrigger className="w-[200px] bg-white">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select onValueChange={setSelectedTrainingMode} value={selectedTrainingMode}>
                    <SelectTrigger className="w-[220px] bg-white">
                        <SelectValue placeholder="All Training Modes" />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                        <SelectItem value="all">All Training Modes</SelectItem>
                        {trainingModes.map(mode => (
                            <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Course Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="p-6 h-[300px] animate-pulse">
                            <div className="space-y-3">
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                        <CourseCard key={course.courseID} course={course} />
                    ))}
                </div>
            )}
        </div>
    )
}


export default CoursesPage