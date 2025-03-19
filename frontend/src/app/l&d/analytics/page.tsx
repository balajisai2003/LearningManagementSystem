"use client";

import React, { useState, useMemo, FC, useEffect } from "react";
import * as XLSX from "xlsx";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProgressData {
    progressID: number;
    employeeID: number;
    courseID: number;
    status: "Completed" | "In Progress" | "Not Started";
    lastUpdated: string;
    startDate: string | null;
    endDate: string | null;
    newOrReUsed: string;
    monthCompleted: string;
    courseDetails: {
        courseID: number;
        title: string;
        resourceLink: string;
        description: string;
        category: string;
        trainingMode: string;
        trainingSource: string;
        durationInWeeks: number;
        durationInHours: number;
        price: number;
        skills: string;
        points: number;
    };
}

const ReportsAnalytics: FC = () => {
    const [hasMounted, setHasMounted] = useState(false);
    const [progressData, setProgressData] = useState<ProgressData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [courseFilter, setCourseFilter] = useState("All");
    const [monthFilter, setMonthFilter] = useState("All");

    useEffect(() => {
        setHasMounted(true);
        fetchProgressData();
    }, []);

    const fetchProgressData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                "https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/CourseProgress/progresses"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch progress data");
            }
            const data = await response.json();
            setProgressData(data.data);
        } catch (error) {
            console.error("Error fetching progress data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Create dynamic filter options
    const courses = useMemo(() => {
        const courseSet = new Set(progressData.map((item) => item.courseDetails.title));
        return ["All", ...Array.from(courseSet)];
    }, [progressData]);

    const months = useMemo(() => {
        const monthSet = new Set(progressData.map((item) => item.monthCompleted));
        return ["All", ...Array.from(monthSet)];
    }, [progressData]);

    // Filtered Data
    const filteredData = useMemo(() => {
        return progressData.filter((row) => {
            const matchesText =
                row.employeeID.toString().includes(searchText.toLowerCase()) ||
                row.courseDetails.title.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = statusFilter === "All" || row.status === statusFilter;
            const matchesCourse = courseFilter === "All" || row.courseDetails.title === courseFilter;
            const matchesMonth = monthFilter === "All" || row.monthCompleted === monthFilter;

            return matchesText && matchesStatus && matchesCourse && matchesMonth;
        });
    }, [progressData, searchText, statusFilter, courseFilter, monthFilter]);

    // Status Distribution Chart
    const statusDistribution = useMemo(() => {
        const counts = {
            Completed: 0,
            "In Progress": 0,
            "Not Started": 0,
        };

        filteredData.forEach((item) => {
            counts[item.status]++;
        });

        return {
            labels: Object.keys(counts),
            datasets: [
                {
                    data: Object.values(counts),
                    backgroundColor: ["#4CAF50", "#FF9800", "#F44336"],
                    hoverOffset: 4,
                },
            ],
        };
    }, [filteredData]);

    const downloadExcel = () => {
        const exportData = filteredData.map((item) => ({
            EmployeeID: item.employeeID,
            Course: item.courseDetails.title,
            Status: item.status,
            MonthCompleted: item.monthCompleted,
            StartDate: item.startDate ? new Date(item.startDate).toLocaleDateString() : "-",
            EndDate: item.endDate ? new Date(item.endDate).toLocaleDateString() : "-",
            TrainingSource: item.courseDetails.trainingSource,
            Points: item.courseDetails.points,
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Progress Report");
        XLSX.writeFile(wb, "progress_report.xlsx");
    };

    if (!hasMounted) return null;

    return (
        <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
                        Training Reports
                    </h1>
                    <button
                        onClick={downloadExcel}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                        Export to Excel
                    </button>
                </div>

                {/* Filters & Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mb-8">
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Search by employee ID or course..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Status Filter */}
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Statuses</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Not Started">Not Started</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Course Filter */}
                            <Select value={courseFilter} onValueChange={setCourseFilter}>
                                <SelectTrigger className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <SelectValue placeholder="All Courses" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((course) => (
                                        <SelectItem key={course} value={course}>
                                            {course === "All" ? "All Courses" : course}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Month Filter */}
                            <Select value={monthFilter} onValueChange={setMonthFilter}>
                                <SelectTrigger className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <SelectValue placeholder="All Months" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((month) => (
                                        <SelectItem key={month} value={month}>
                                            {month === "All" ? "All Months" : month}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                        <h2 className="text-sm font-semibold text-gray-600 mb-3">
                            Completion Status
                        </h2>
                        <div className="h-48">
                            <Pie
                                data={statusDistribution}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: "bottom",
                                            labels: {
                                                boxWidth: 12,
                                                padding: 16,
                                                font: { size: 12 },
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    {loading ? (
                        <div className="p-6 text-center text-gray-500">Loading...</div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                        Employee ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                        Course
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                        Month Completed
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                        Start Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                        End Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                        Training Source
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                        Points
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredData.map((row) => (
                                    <tr key={row.progressID} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-800">{row.employeeID}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{row.courseDetails.title}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === "Completed"
                                                    ? "bg-green-100 text-green-800"
                                                    : row.status === "In Progress"
                                                        ? "bg-orange-100 text-orange-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{row.monthCompleted}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">
                                            {row.startDate ? new Date(row.startDate).toLocaleDateString() : "-"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-800">
                                            {row.endDate ? new Date(row.endDate).toLocaleDateString() : "-"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{row.courseDetails.trainingSource}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{row.courseDetails.points}</td>
                                    </tr>
                                ))}
                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-6 text-center text-sm text-gray-500">
                                            No matching records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsAnalytics;
