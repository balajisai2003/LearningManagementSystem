import { ChevronRight, Loader2, Play } from 'lucide-react';
import React from 'react'
import { Button } from './ui/button';
import { Course } from '@/redux/features/employeeDataSlice';
import { Status } from '@/types/Status';

interface CourseCardProps {
    video: Course;
    handleCourseComplete: (progressID: number) => void;
    loadingProgressId: number | null;
}

const CourseCard: React.FC<CourseCardProps> = ({ video, handleCourseComplete, loadingProgressId }) => {
    return (
        <div className="p-1 box-border">
            <div className="card-style w-full p-2 flex flex-col justify-between rounded-xl bg-white shadow-md border hover:shadow-lg transition-all duration-300 h-[250px]">
                <div className="font-semibold text-sm flex items-start space-x-2">
                    <h3 className="flex-1">
                        {video.courseDetails.title}
                    </h3>
                    <div className="flex justify-end items-center">
                        <p
                            className={`text-xs font-medium px-4 py-1 shadow-md rounded-lg ${video.status === "Completed"
                                ? "bg-[#4CAF50] text-white"
                                : video.status === Status.Started
                                    ? "bg-[#FFC107] text-white"
                                    : "bg-[#F44336] text-white"
                                }`}
                        >
                            {video.status}
                        </p>
                    </div>
                </div>
                {video.courseDetails.description && (
                    <div>
                        <p className="text-sm text-gray-600 italic">
                            {video.courseDetails.description}
                        </p>
                    </div>
                )}
                <div className="w-full flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                            Duration: {video.courseDetails.durationInWeeks} weeks, {video.courseDetails.durationInHours} hours
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <a
                            href={video.courseDetails.resourceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary/90 hover:bg-primary flex items-center space-x-2 text-white text-sm px-4 py-2 rounded-md transition-all duration-300"
                        >
                            <span>Continue</span>
                            <ChevronRight size={20} />
                        </a>
                        {video.status === Status.Started && (
                            <Button
                                onClick={() => handleCourseComplete(video.progressID)}
                                className="flex items-center space-x-2 bg-[#FFC107] hover:bg-[#e6b300] text-white text-sm px-4 py-2 rounded-md transition-all duration-300"
                                disabled={loadingProgressId === video.progressID}
                            >
                                {loadingProgressId === video.progressID ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Start</span>
                                        <Play size={20} />
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default CourseCard