"use client"

import React, { FC, useEffect, useState } from 'react'
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
    ArcElement
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'
import DateRangePicker from '@/components/DateRangePicker/DateRangePicker'
import { generateDummyData } from '@/lib/generateDummyData'

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
)

const Dashboard: FC = () => {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
    const [metrics, setMetrics] = useState({
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
    })
    const [chartData, setChartData] = useState<{
        barData: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string }[] },
        pieData: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string[] }[] },
        lineData: { labels: string[]; datasets: { label: string; data: number[]; borderColor: string; tension: number }[] }
    }>({
        barData: { labels: [], datasets: [] },
        pieData: { labels: [], datasets: [] },
        lineData: { labels: [], datasets: [] }
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchData()
    }, [dateRange])

    const fetchData = async () => {
        setLoading(true)
        // Simulate API call with 500ms delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Generate dummy data based on date range
        const data = generateDummyData(dateRange)

        setMetrics(data.metrics)
        setChartData({
            barData: {
                labels: data.barLabels,
                datasets: [{
                    label: 'Courses Completed',
                    data: data.barValues,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                }]
            },
            pieData: {
                labels: ['Completed', 'In Progress', 'Not Started'],
                datasets: [{
                    label: 'Course Status',
                    data: [data.metrics.completedCourses, data.metrics.inProgressCourses,
                    data.metrics.totalCourses - data.metrics.completedCourses - data.metrics.inProgressCourses],
                    backgroundColor: ['#4caf50', '#ff9800', '#f44336']
                }]
            },
            lineData: {
                labels: data.lineLabels,
                datasets: [{
                    label: 'New Training Requests',
                    data: data.lineValues,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            }
        })
        setLoading(false)
    }

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">LnD Dashboard</h1>
                    <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
                </div>

                {loading && (
                    <div className="text-center p-4 text-gray-500">Loading data...</div>
                )}

                {!loading && (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {Object.entries(metrics).map(([key, value]) => (
                                <div key={key} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <h2 className="text-sm font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h2>
                                    <p className="text-2xl font-semibold mt-2 text-gray-900">{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">Course Completions</h2>
                                <div className="h-64">
                                    <Bar
                                        data={chartData.barData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { position: 'top' },
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">Status Distribution</h2>
                                <div className="h-64">
                                    <Pie
                                        data={chartData.pieData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { position: 'bottom' },
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">Training Requests Trend</h2>
                            <div className="h-64">
                                <Line
                                    data={chartData.lineData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { position: 'top' },
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Dashboard