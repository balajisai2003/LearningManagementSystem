import React from "react";
import { Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const PointsCard = () => {
    return (
        <div className="bg-gradient-to-br from-white to-gray-50  h-full p-6 flex flex-col items-center justify-center space-y-4 transition-all duration-300 ease-in-out">

            <div className="bg-primary/10 p-3 rounded-full">
                <Trophy className="text-primary w-10 h-10" />
            </div>

            {/* Points */}
            <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-gray-800">1,250</span>
                <span className="text-sm text-gray-500 font-medium">Points</span>
            </div>

            {/* Learner Level */}
            <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-xs font-medium">
                <Star className="w-4 h-4" />
                <span>Gold Learner</span>
            </div>

            {/* Button */}
            <Button
                className="text-sm font-medium w-full bg-primary hover:bg-primary/90 rounded-lg py-2"
                variant="default"
            >
                View Achievements
            </Button>
        </div>
    );
};

export default PointsCard;
