import axiosInstance from '@/lib/axiosInstance'
import { Calendar, CheckCircle, Info, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const BrownBagRequests = ({ selectedCategory }: { selectedCategory: string }) => {
    const [loading, setLoading] = useState(false)
    const [brownBagRequests, setBrownBagRequests] = useState<any[]>([])
    useEffect(() => {
        const fetchBrownBagRequests = async () => {
            try {
                setLoading(true)
                const userStr = JSON.parse(sessionStorage.getItem('user') || '{}')
                const response = await axiosInstance.get(
                    `https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/BrownBagRequest/Requests/Employee/${userStr?.employeeID}`
                )
                if (response.data) {
                    console.log("Brown Bag Requests:", response.data.data)
                    setBrownBagRequests(response.data.data)
                }
            } catch (error) {
                console.error("Error fetching Brown Bag Requests:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchBrownBagRequests()
    }, [])

    return (

        <div>
            <h2 className="text-2xl font-bold mb-4">
                {selectedCategory}
                <span className="text-base text-gray-500 ml-2">
                    ({brownBagRequests.length})
                </span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? <p>Loading...</p> :
                    brownBagRequests.map((session: any) => (
                        <div
                            key={session.requestId}
                            className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition duration-200"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">{session.topicName}</h2>
                                <CheckCircle className="text-green-500" size={20} />
                            </div>
                            <p className="text-sm text-gray-600 mb-2 flex items-center">
                                <User className="mr-1" size={16} /> {session.employeeName}
                            </p>
                            <p className="text-sm text-gray-600 mb-2 flex items-center">
                                <Info className="mr-1" size={16} /> {session.topicType}
                            </p>
                            <p className="text-sm text-gray-600 mb-2 flex items-center">
                                <Calendar className="mr-1" size={16} />
                                {new Date(session.requestDate).toLocaleString()}
                            </p>
                            <p className="text-gray-800 mb-4">{session.agenda}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default BrownBagRequests