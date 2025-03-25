import axiosInstance from '@/lib/axiosInstance';
import React, { SetStateAction, useEffect, useState } from 'react';
import CourseCard from './CourseCard';

// You might want to pass employeeID as a prop if userStr is not globally available.
const RequestedCourses = ({ setLoading }: { setLoading: React.Dispatch<SetStateAction<boolean>> }) => {
    const [requestedCourses, setRequestedCourses] = useState<any[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const reqCourses = await axiosInstance.get(
                    `https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/CoursesRequest/Requests/Employee/${employeeID}`
                );
                // Optionally fetch all courses if needed
                // const allCourses = await axiosInstance.get('https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/Courses/AllCourses');
                setRequestedCourses(reqCourses.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [setLoading]);

    return requestedCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {requestedCourses.map((course) => (
                <CourseCard
                    key={course.progressID}
                    video={course}
                    handleCourseComplete={() => { }}
                    loadingProgressId={null}
                />
            ))}
        </div>
    ) : (
        <p>No requested courses found.</p>
    );
};

export default RequestedCourses;
