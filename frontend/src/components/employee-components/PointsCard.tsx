import { useAppSelector } from '@/redux/app/hooks';
import { Status } from '@/types/Status';
import { Trophy, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

const PointsCard = () => {
    const [totalPoints, setTotalPoints] = useState(0);
    const { courses } = useAppSelector(state => state.employeeDataSlice);
    useEffect(() => {
        const points = courses.filter((course) => course.status === Status.Completed).reduce((sum, course) => sum + (course.courseDetails?.points || 0), 0);
        let count = 0
        const interval = setInterval(() => {
            if (points < 1) {
                clearInterval(interval);
            }
            else if (count < points && count < 50) {
                setTotalPoints(count)
                count += 1
            }
            else {
                setTotalPoints(points);
                clearInterval(interval);
            }
        }, 20)
        return () => clearInterval(interval);
    }, [courses])

    // Determine learner level based on points
    const getLearnerLevel = (points: number) => {
        if (points >= 2000) return { name: "Platinum Learner", color: "bg-gray-100 text-gray-800" };
        if (points >= 1000) return { name: "Gold Learner", color: "bg-yellow-100 text-yellow-800" };
        if (points >= 500) return { name: "Silver Learner", color: "bg-blue-100 text-blue-800" };
        return { name: "Bronze Learner", color: "bg-orange-100 text-orange-800" };
    };

    const learnerLevel = getLearnerLevel(totalPoints);

    return (
        <div className="flex flex-col h-full items-center justify-center space-y-4 transition-all duration-300 ease-in-out hover:shadow-md">
            {/* Trophy Icon */}
            <div className="bg-primary/10 p-4 rounded-full">
                <Trophy className="text-primary w-8 h-8" strokeWidth={2} />
            </div>

            {/* Points Display */}
            <div className="text-center">
                <div className="flex items-baseline justify-center space-x-2">
                    <span className="text-4xl font-extrabold text-gray-900">{totalPoints.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 font-medium">Points</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Earned from {courses.length} courses</p>
            </div>

            {/* Learner Level */}
            <div className={`flex items-center space-x-2 ${learnerLevel.color} px-4 py-1.5 rounded-full text-sm font-medium`}>
                <Star className="w-4 h-4" />
                <span>{learnerLevel.name}</span>
            </div>
        </div>
    );
};

export default PointsCard;