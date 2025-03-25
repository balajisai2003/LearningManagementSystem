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
import axiosInstance from "@/lib/axiosInstance";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CourseDetails {
    category: string;
    courseID: number;
    description: string;
    durationInHours: number;
    durationInWeeks: number;
    points: number;
    price: number | null;
    resourceLink: string;
    skills: string;
    title: string;
    trainingMode: string;
    trainingSource: string;
}

interface EmployeeDetails {
    cadre: string;
    designation: string;
    email: string;
    employeeID: number;
    location: string;
    name: string;
    password: string;
    role: string;
    techGroup: string;
}

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
    courseDetails: CourseDetails;
    employeeDetails: EmployeeDetails;
}

const ReportsAnalytics: FC = () => {
    const [hasMounted, setHasMounted] = useState(false);
    const [progressData, setProgressData] = useState<ProgressData[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [globalSearch, setGlobalSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [courseFilter, setCourseFilter] = useState("All");
    const [monthFilter, setMonthFilter] = useState("All");
    const [employeeNameFilter, setEmployeeNameFilter] = useState("");
    const [designationFilter, setDesignationFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [startDateRange, setStartDateRange] = useState<{ start: string; end: string }>({
        start: "",
        end: "",
    });
    const [pointsRange, setPointsRange] = useState<{ min: string; max: string }>({
        min: "",
        max: "",
    });

    useEffect(() => {
        setHasMounted(true);
        fetchProgressData();
    }, []);

    const fetchProgressData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                "https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/CourseProgress/progresses"
            );
            const data = await response.data;
            setProgressData(data.data);
        } catch (error) {
            console.error("Error fetching progress data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Dynamic Filter Options
    const courseOptions = useMemo(() => {
        const courseSet = new Set(progressData.map((item) => item.courseDetails.title));
        return ["All", ...Array.from(courseSet)];
    }, [progressData]);

    const monthOptions = useMemo(() => {
        const monthSet = new Set(progressData.map((item) => item.monthCompleted));
        return ["All", ...Array.from(monthSet)];
    }, [progressData]);

    // Filtered Data
    const filteredData = useMemo(() => {
        return progressData.filter((row) => {
            const lowerGlobal = globalSearch?.toLowerCase();
            const lowerEmployeeName = employeeNameFilter?.toLowerCase();
            const lowerDesignation = designationFilter?.toLowerCase();
            const lowerLocation = locationFilter?.toLowerCase();

            const matchesGlobal =
                row.employeeID.toString().includes(lowerGlobal) ||
                row.courseDetails.title?.toLowerCase().includes(lowerGlobal) ||
                row.employeeDetails.name?.toLowerCase().includes(lowerGlobal) ||
                row.employeeDetails.email?.toLowerCase().includes(lowerGlobal);

            const matchesEmployeeName = row.employeeDetails.name?.toLowerCase().includes(lowerEmployeeName);
            const matchesDesignation = row.employeeDetails.designation?.toLowerCase().includes(lowerDesignation);
            const matchesLocation = row.employeeDetails.location?.toLowerCase().includes(lowerLocation);
            const matchesStatus = statusFilter === "All" || row.status === statusFilter;
            const matchesCourse = courseFilter === "All" || row.courseDetails.title === courseFilter;
            const matchesMonth = monthFilter === "All" || row.monthCompleted === monthFilter;

            let matchesStartDate = true;
            if (startDateRange.start || startDateRange.end) {
                if (row.startDate) {
                    const rowDate = new Date(row.startDate).getTime();
                    if (startDateRange.start) {
                        const startTime = new Date(startDateRange.start).getTime();
                        if (rowDate < startTime) matchesStartDate = false;
                    }
                    if (startDateRange.end) {
                        const endTime = new Date(startDateRange.end).getTime();
                        if (rowDate > endTime) matchesStartDate = false;
                    }
                } else {
                    matchesStartDate = false;
                }
            }

            let matchesPoints = true;
            const points = row.courseDetails.points;
            if (pointsRange.min) {
                if (points < parseFloat(pointsRange.min)) matchesPoints = false;
            }
            if (pointsRange.max) {
                if (points > parseFloat(pointsRange.max)) matchesPoints = false;
            }

            return (
                matchesGlobal &&
                matchesEmployeeName &&
                matchesDesignation &&
                matchesLocation &&
                matchesStatus &&
                matchesCourse &&
                matchesMonth &&
                matchesStartDate &&
                matchesPoints
            );
        });
    }, [
        progressData,
        globalSearch,
        employeeNameFilter,
        designationFilter,
        locationFilter,
        statusFilter,
        courseFilter,
        monthFilter,
        startDateRange,
        pointsRange,
    ]);

    // Status Distribution Chart Data
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
            EmployeeName: item.employeeDetails.name,
            Designation: item.employeeDetails.designation,
            Email: item.employeeDetails.email,
            Location: item.employeeDetails.location,
            Cadre: item.employeeDetails.cadre,
            Role: item.employeeDetails.role,
            TechGroup: item.employeeDetails.techGroup,
            Course: item.courseDetails.title,
            Category: item.courseDetails.category,
            TrainingMode: item.courseDetails.trainingMode,
            TrainingSource: item.courseDetails.trainingSource,
            Price: item.courseDetails.price ?? "Free",
            DurationWeeks: item.courseDetails.durationInWeeks,
            DurationHours: item.courseDetails.durationInHours,
            Skills: item.courseDetails.skills,
            ResourceLink: item.courseDetails.resourceLink,
            Description: item.courseDetails.description,
            Status: item.status,
            MonthCompleted: item.monthCompleted,
            StartDate: item.startDate ? new Date(item.startDate).toLocaleDateString() : "-",
            EndDate: item.endDate ? new Date(item.endDate).toLocaleDateString() : "-",
            NewOrReUsed: item.newOrReUsed,
            Points: item.courseDetails.points,
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Progress Report");
        XLSX.writeFile(wb, `progress_report-${new Date().toISOString()}.xlsx`);

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

                <div className="flex items-start justify-between w-full space-x-6 mb-6">
                    {/* Filters Section: 75% width */}
                    <div className="w-3/4 space-y-6">
                        <input
                            type="text"
                            placeholder="Global search (ID, course, name, email)..."
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Employee Name"
                                value={employeeNameFilter}
                                onChange={(e) => setEmployeeNameFilter(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                                type="text"
                                placeholder="Designation"
                                value={designationFilter}
                                onChange={(e) => setDesignationFilter(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                            <Select value={courseFilter} onValueChange={setCourseFilter}>
                                <SelectTrigger className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <SelectValue placeholder="All Courses" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courseOptions.map((course) => (
                                        <SelectItem key={course} value={course}>
                                            {course === "All" ? "All Courses" : course}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={monthFilter} onValueChange={setMonthFilter}>
                                <SelectTrigger className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <SelectValue placeholder="All Months" />
                                </SelectTrigger>
                                <SelectContent>
                                    {monthOptions.map((month) => (
                                        <SelectItem key={month} value={month}>
                                            {month === "All" ? "All Months" : month}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date and Points Range Filters */}
                        <div className="space-x-6 flex ">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-700 font-medium">Start Date Range</label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={startDateRange.start}
                                        onChange={(e) =>
                                            setStartDateRange((prev) => ({ ...prev, start: e.target.value }))
                                        }
                                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <input
                                        type="date"
                                        value={startDateRange.end}
                                        onChange={(e) =>
                                            setStartDateRange((prev) => ({ ...prev, end: e.target.value }))
                                        }
                                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-700 font-medium">Points Range</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={pointsRange.min}
                                        onChange={(e) =>
                                            setPointsRange((prev) => ({ ...prev, min: e.target.value }))
                                        }
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={pointsRange.max}
                                        onChange={(e) =>
                                            setPointsRange((prev) => ({ ...prev, max: e.target.value }))
                                        }
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart Section: 25% width */}
                    <div className="w-1/4">
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                            <h2 className="text-sm font-semibold text-gray-600 mb-3">Completion Status</h2>
                            <div className="h-48">
                                <Pie
                                    data={statusDistribution}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: "bottom",
                                                labels: { boxWidth: 12, padding: 16, font: { size: 12 } },
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>


                {/* Table Container */}
                <div className="bg-white rounded-xl border shadow-xs overflow-hidden max-w-[95vw] mx-auto">
                    {loading ? (
                        <div className="p-8 flex items-center justify-center h-[60vh]">
                            <div className="animate-pulse flex space-x-4">
                                <div className="flex-1 space-y-4 py-1">
                                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                    <div className="space-y-2">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="h-4 bg-gray-100 rounded"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-auto h-[60vh] w-[75vw]">
                            <table className="w-full table-fixed min-w-[1200px]">
                                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                                    <tr>
                                        {/* Employee Columns */}
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-[350px]">
                                            Employee
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-[150px]">
                                            ID
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-[150px]">
                                            Designation
                                        </th>

                                        {/* Course Columns */}
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide bg-gray-50 w-[400px]">
                                            Course Details
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-[150px]">
                                            Duration
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-[300px]">
                                            Skills
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-[100px]">
                                            Resources
                                        </th>

                                        {/* Progress Columns */}
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide bg-gray-50 w-[150px]">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-[200px]">
                                            Timeline
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide w-[100px]">
                                            Points
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredData.map((row) => (
                                        <tr key={row.progressID} className="hover:bg-gray-50 transition-colors">
                                            {/* Employee Info */}
                                            <td className="px-5 py-4 text-sm font-medium text-gray-900 bg-white w-[350px]">
                                                <div className="flex items-center">
                                                    <div className="ml-4">
                                                        <div className="font-medium">{row.employeeDetails?.name}</div>
                                                        <div className="text-gray-500 text-xs mt-1">
                                                            {row.employeeDetails?.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-700 w-[150px]">
                                                {row.employeeID}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-700 w-[150px]">
                                                <div className="text-gray-900">{row.employeeDetails?.designation}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {row.employeeDetails?.location}
                                                </div>
                                            </td>

                                            {/* Course Info */}
                                            <td className="px-5 py-4 text-sm text-gray-700 bg-gray-50 w-[400px]">
                                                <div className="font-medium">{row.courseDetails.title}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {row.courseDetails?.category} • {row.courseDetails?.trainingMode}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-700 w-[150px]">
                                                {row.courseDetails?.durationInWeeks} weeks
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {row.courseDetails?.durationInHours} hours
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-700 w-[300px]">
                                                <div className="flex flex-wrap gap-1">
                                                    {row.courseDetails?.skills?.split(',').map((skill, i) => (
                                                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-xl">
                                                            {skill.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-700 w-[100px]">
                                                <a
                                                    href={row.courseDetails?.resourceLink}
                                                    className="inline-flex items-center text-blue-600 hover:text-blue-900"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    Link
                                                </a>
                                            </td>

                                            {/* Progress Info */}
                                            <td className="px-5 py-4 bg-gray-50 w-[150px]">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${row.status === "Completed" ? 'bg-green-100 text-green-800' :
                                                            row.status === "In Progress" ? 'bg-orange-100 text-orange-800' :
                                                                'bg-red-100 text-red-800'}`}>
                                                        {row.status}
                                                    </span>
                                                    <div className="text-xs text-gray-500">
                                                        {row.monthCompleted}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-700 w-[200px]">
                                                <div className="flex flex-col items-center space-y-2 text-xs">
                                                    <span>{row.startDate ? new Date(row.startDate).toLocaleDateString() : '-'}</span>
                                                    <span>to</span>
                                                    <span>{row.endDate ? new Date(row.endDate).toLocaleDateString() : '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm font-medium text-gray-900 w-[100px]">
                                                {row.courseDetails.points}
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Empty State */}
                                    {filteredData.length === 0 && (
                                        <tr>
                                            <td colSpan={10} className="px-5 py-6 text-center text-sm text-gray-500">
                                                No matching records found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsAnalytics;
