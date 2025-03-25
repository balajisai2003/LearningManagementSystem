"use client";

import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import DateRangePicker from "@/components/DateRangePicker/DateRangePicker";
import axiosInstance from "@/lib/axiosInstance";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    Award,
    Clock,
    Users,
    ChevronRight,
    Loader2,
    AlertCircle,
    XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { addRequests, Requests } from "@/redux/features/lndDataSlice";
import { TrainingMode } from "@/lib/trainingMode";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface Employee {
    employeeID: number;
    name: string;
    designation: string;
    cadre: string;
    techGroup: string;
    location: string;
}

interface Course {
    courseID: number;
    title: string;
    resourceLink: string;
    description: string;
    category: string;
    trainingMode: string;
    trainingSource: string;
    durationInWeeks: number;
    durationInHours: number;
    price: number | null;
    skills: string;
    points: number;
}

interface Request {
    progressID: number;
    employeeID: number;
    employeeDetails: Employee;
    courseID: number;
    status: "Not Started" | "Started" | "Completed";
    lastUpdated: string;
    startDate: string;
    endDate: string;
    monthCompleted: string | null;
    courseDetails: Course;
}

interface ModalProps {
    request: Request | null;
    onClose: () => void;
}

const DetailModal: React.FC<ModalProps> = ({ request, onClose }) => {
    if (!request) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <XCircle size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4">{request.courseDetails.title}</h2>
                <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Employee:</span>{" "}
                    {request.employeeDetails.name} - {request.employeeDetails.designation}
                </p>
                <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Status:</span> {request.status}
                </p>
                <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Duration:</span>{" "}
                    {request.courseDetails.durationInHours} hrs over {request.courseDetails.durationInWeeks} wks
                </p>
                <p className="text-gray-600 mb-2">
                    <span className="font-semibold">Points Earned:</span> {request.courseDetails.points} pts
                </p>
                <p className="text-gray-600 mb-4">
                    <span className="font-semibold">Description:</span>{" "}
                    {request.courseDetails.description}
                </p>
                <Button onClick={onClose} className="w-full mt-4">
                    Close
                </Button>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const router = useRouter();
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const { requests: reduxSavedRequests } = useAppSelector((state) => state.lndDataSlice);
    const dispatch = useAppDispatch()
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(
                    "https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/CourseProgress/progresses"
                );
                if (response.status === 200) {
                    const sortedRequests = response.data.data.sort(
                        (a: Request, b: Request) =>
                            new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
                    );
                    setRequests(sortedRequests);
                    dispatch(addRequests(sortedRequests as Requests[]));
                }
            } catch (err) {
                setError("Failed to fetch training data");
                console.error("Error fetching training requests:", err);
            } finally {
                setLoading(false);
            }
        };
        if (reduxSavedRequests.length > 0) {
            setRequests(reduxSavedRequests as Requests[]);
        }
        else {
            fetchRequests();
        }
    }, [dispatch, requests]);

    // Updated KPI calculations based on the new statuses
    const completedCount = requests.filter((r) => r.status === "Completed").length;
    const startedCount = requests.filter((r) => r.status === "Started").length;
    const notStartedCount = requests.filter((r) => r.status === "Not Started").length;

    const coursePopularity = requests.reduce((acc, request) => {
        const course = request.courseDetails.title;
        acc[course] = (acc[course] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const monthlyTrend = requests
        .filter((r) => r.status === "Completed" && r.monthCompleted)
        .reduce((acc, r) => {
            const month = r.monthCompleted!;
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    const sortedMonths = Object.keys(monthlyTrend).sort((a, b) => b.localeCompare(a));

    const trainingModeDistribution = requests.reduce((acc, request) => {
        const mode = request.courseDetails.trainingMode || "Unknown";
        if (TrainingMode.includes(mode)) {
            acc[mode] = (acc[mode] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);
    console.log("Training Mode Distribution:", trainingModeDistribution);
    const trainingModeLabels = Object.keys(trainingModeDistribution);
    const trainingModeData = Object.values(trainingModeDistribution);

    const topEmployees: any[] = Object.entries(
        requests.reduce((acc, request) => {
            if (request.status === "Completed") {
                const emp = request.employeeDetails.name;
                acc[emp] = (acc[emp] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>)
    ).sort((a: any, b: any) => b[1] - a[1]).slice(0, 3);

    // Additional KPI: Average training duration (in hours) for completed trainings
    const avgDuration =
        requests.filter((r) => r.status === "Completed").reduce((acc, r) => {
            return acc + r.courseDetails.durationInHours;
        }, 0) / (completedCount || 1);

    // Additional KPI: Average points earned per training (for completed trainings)
    const avgPoints =
        requests.filter((r) => r.status === "Completed").reduce((acc, r) => {
            return acc + r.courseDetails.points;
        }, 0) / (completedCount || 1);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <p className="text-xl text-gray-600">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            L &amp; D Dashboard
                        </h1>

                    </div>
                    <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
                </div>

                {/* Loader */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <>
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <Card className="p-4 bg-gradient-to-r from-blue-100 to-blue-50 shadow-sm hover:shadow-lg transition-shadow md:col-span-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Trainings</p>
                                        <h3 className="text-2xl font-bold mt-1">{requests.length}</h3>
                                    </div>
                                    <div className="p-3 bg-blue-200 rounded-full">
                                        <BookOpen className="h-6 w-6 text-blue-700" />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4 bg-gradient-to-r from-green-100 to-green-50 shadow-sm hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Completed</p>
                                        <h3 className="text-2xl font-bold mt-1">{completedCount}</h3>
                                    </div>
                                    <div className="p-3 bg-green-200 rounded-full">
                                        <Award className="h-6 w-6 text-green-700" />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4 bg-gradient-to-r from-yellow-100 to-yellow-50 shadow-sm hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Started</p>
                                        <h3 className="text-2xl font-bold mt-1">{startedCount}</h3>
                                    </div>
                                    <div className="p-3 bg-yellow-200 rounded-full">
                                        <Clock className="h-6 w-6 text-yellow-700" />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4 bg-white shadow-sm hover:shadow-lg transition-shadow">
                                <div>
                                    <p className="text-sm text-gray-600">Avg Duration</p>
                                    <h3 className="text-2xl font-bold mt-1">{avgDuration.toFixed(1)} hrs</h3>
                                </div>
                            </Card>

                            <Card className="p-4 bg-white shadow-sm hover:shadow-lg transition-shadow">
                                <div>
                                    <p className="text-sm text-gray-600">Avg Points</p>
                                    <h3 className="text-2xl font-bold mt-1">{avgPoints.toFixed(1)} pts</h3>
                                </div>
                            </Card>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="p-6 bg-white shadow-sm rounded-lg">
                                <h2 className="text-lg font-semibold mb-4">Training Status Distribution</h2>
                                <div className="h-64">
                                    <Pie
                                        data={{
                                            labels: ["Completed", "Started", "Not Started"],
                                            datasets: [
                                                {
                                                    data: [completedCount, startedCount, notStartedCount],
                                                    backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
                                                    borderWidth: 1,
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { position: "bottom" },
                                            },
                                        }}
                                    />
                                </div>
                            </Card>

                            <Card className="p-6 bg-white shadow-sm rounded-lg">
                                <h2 className="text-lg font-semibold mb-4">Top Courses</h2>
                                <div className="h-64">
                                    <Bar
                                        data={{
                                            labels: Object.keys(coursePopularity).map(m => `${m.slice(0, 15)}...`).slice(0, 5),
                                            datasets: [
                                                {
                                                    label: "Enrollments",
                                                    data: Object.values(coursePopularity).slice(0, 5),
                                                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { display: false },
                                            },
                                            scales: {
                                                y: { beginAtZero: true },
                                            },
                                        }}
                                    />
                                </div>
                            </Card>
                        </div>

                        {/* Additional Insights */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="p-6 bg-white shadow-sm rounded-lg">
                                <h2 className="text-lg font-semibold mb-4">Monthly Trend (Completed Trainings)</h2>
                                <div className="h-64">
                                    <Line
                                        data={{
                                            labels: sortedMonths,
                                            datasets: [
                                                {
                                                    label: "Completed Trainings",
                                                    data: sortedMonths.map((month) => monthlyTrend[month]),
                                                    fill: false,
                                                    borderColor: "#4CAF50",
                                                    tension: 0.1,
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { position: "bottom" },
                                            },
                                        }}
                                    />
                                </div>
                            </Card>

                            <Card className="p-6 bg-white shadow-sm rounded-lg">
                                <h2 className="text-lg font-semibold mb-4">Training Mode Distribution</h2>
                                <div className="h-64">
                                    {trainingModeLabels.length > 0 ? (
                                        <Pie
                                            data={{
                                                labels: trainingModeLabels,
                                                datasets: [
                                                    {
                                                        data: trainingModeData,
                                                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                                                        borderWidth: 1,
                                                    },
                                                ],
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: { position: "bottom" },
                                                },
                                            }}
                                        />
                                    ) : (
                                        <p className="text-center text-gray-500">No Training Mode Data</p>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Recent Completions and Top Performers */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="p-6 bg-white shadow-sm rounded-lg">
                                <h2 className="text-lg font-semibold mb-4">Top Performers</h2>
                                <div className="space-y-4">
                                    {topEmployees.map(([name, count]) => (
                                        <div
                                            key={name}
                                            className="flex items-center justify-between p-2 hover:bg-gray-50 transition-colors rounded cursor-pointer"
                                            onClick={() => {
                                                const found = requests.find(
                                                    (r) => r.employeeDetails.name === name && r.status === "Completed"
                                                );
                                                if (found) setSelectedRequest(found);
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gray-100 p-2 rounded-full">
                                                    <Users className="h-5 w-5 text-gray-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {count} course{count > 1 && "s"} completed
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="p-6 bg-white shadow-sm rounded-lg lg:col-span-2">
                                <h2 className="text-lg font-semibold mb-4">Recent Completions</h2>
                                <div className="overflow-hidden">
                                    <div className="grid grid-cols-1 gap-4">
                                        {requests
                                            .filter((r) => r.status === "Completed")
                                            .slice(0, 3)
                                            .map((request) => (
                                                <div
                                                    key={request.progressID}
                                                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                                    onClick={() => setSelectedRequest(request)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-medium">{request.courseDetails.title}</h3>
                                                            <p className="text-sm text-gray-500">{request.employeeDetails.name}</p>
                                                        </div>
                                                        <Badge variant="outline" className="text-green-600 border-green-200">
                                                            {request.monthCompleted}
                                                        </Badge>
                                                    </div>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {request.courseDetails.points} pts
                                                        </Badge>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {request.courseDetails.durationInHours} hrs
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <Button className="w-full mt-6" onClick={() => router.push("l&d/training-requests")}>
                            View All Training Requests
                        </Button>
                    </>
                )}
            </div>

            {selectedRequest && (
                <DetailModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />
            )}
        </div>
    );
};

export default Dashboard;
