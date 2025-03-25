import axiosInstance from "@/lib/axiosInstance"
import { useAppDispatch } from "@/redux/app/hooks"
import { setEmpDetails } from "@/redux/features/employeeDataSlice"
import { Status } from "@/types/Status"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import CardSkimmer from "../CardSkimmer"
import { LoaderCircle } from "lucide-react"

interface RequestData {
    requestID: number
    requestDate: string
    status: string
    employeeID: number
    requestEmpIDs: string
    courseDetails: {
        title: string
        description: string
        trainingMode: string
        trainingSource: string
    }
}

interface RequestCardProps {
    data: RequestData;
    isAdmin?: boolean;
    handleApprove?: (id: number) => void;
    handleReject?: (id: number) => void;
    loadingAction?: { requestId: number; action: "approve" | "reject" } | null;
}
const statusStyles: Record<Status, string> = {
    [Status.Pending]: "bg-yellow-100 text-yellow-800",
    [Status.Rejected]: "bg-red-100 text-red-800",
    [Status.NotStarted]: "",
    [Status.Started]: "",
    [Status.Completed]: "",
    [Status.Approved]: "bg-green-100 text-green-800"
}




export const RequestCard: React.FC<RequestCardProps> = ({ data, isAdmin = false, handleApprove, handleReject, loadingAction }) => {
    const [expanded, setExpanded] = useState(false)
    const {
        requestID,
        requestDate,
        status,
        requestEmpIDs,
        employeeID
    } = data

    const { title, description, trainingMode, trainingSource } = data?.courseDetails


    const isGroupRequest = requestEmpIDs?.includes(',')
    const employees = isGroupRequest ? requestEmpIDs.split(',') : []
    const formattedDate = new Date(requestDate).toLocaleDateString()
    const formattedTime = new Date(requestDate).toLocaleTimeString()

    return (
        <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h2 className="text-xl font-semibold mb-1">{title}</h2>
                    <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground">Request ID #{requestID}</p>

                        <p className="text-sm text-muted-foreground">Employee ID #{employeeID}</p>
                    </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-sm ${statusStyles[status as Status]}`}>
                    {status}
                </span>
            </div>

            <div className="mb-4">
                <p className={`text-gray-600 ${!expanded && "line-clamp-2"}`}>
                    {description}
                </p>
                <Button
                    variant="link"
                    className="h-auto p-0 text-blue-600"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? "Show less" : "Read more"}
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8 14q-.425 0-.713-.288T7 13q0-.425.288-.713T8 12q.425 0 .713.288T9 13q0 .425-.288.713T8 14Zm4 0q-.425 0-.713-.288T11 13q0-.425.288-.713T12 12q.425 0 .713.288T13 13q0 .425-.288.713T12 14Zm4 0q-.425 0-.713-.288T15 13q0-.425.288-.713T16 12q.425 0 .713.288T17 13q0 .425-.288.713T16 14ZM5 22q-.825 0-1.413-.588T3 20V6q0-.825.588-1.413T5 4h1V2h2v2h8V2h2v2h1q.825 0 1.413.588T21 6v14q0 .825-.588 1.413T19 22H5Zm0-2h14V10H5v10Z" />
                    </svg>
                    <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{formattedDate}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm0-8Zm2.8 3.2l1.4-1.4l-3.2-3.2V8h-2v3.4l3.2 3.2Z" />
                    </svg>
                    <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">{formattedTime}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M2 20V4h20v16H2Zm10-7l8-5V6l-8 5l-8-5v2l8 5Z" />
                    </svg>
                    <div>
                        <p className="text-sm text-muted-foreground">Mode</p>
                        <p className="font-medium">{trainingMode}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 24 24">
                        <path fill="currentColor" d="m12 16l4-4h-3V4h-2v8H8l4 4Zm-6 4q-.825 0-1.413-.588T4 18v-3h2v3h12v-3h2v3q0 .825-.588 1.413T18 20H6Z" />
                    </svg>
                    <div>
                        <p className="text-sm text-muted-foreground">Source</p>
                        <p className="font-medium">{trainingSource}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                    {isGroupRequest ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M2 22v-1.8q0-.85.438-1.563T3.6 17.55q1.55-.775 3.15-1.163T10 16q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T18 20.2V22H2Zm18 0v-1.8q0-1.25-.788-2.125T17 17q1.2.15 2.1.775T20 20.2V22h2ZM10 14q-1.65 0-2.825-1.175T6 10q0-1.65 1.175-2.825T10 6q1.65 0 2.825 1.175T14 10q0 1.65-1.175 2.825T10 14Zm6-4q0 1.65-1.175 2.825T12 12q-.275 0-.7-.063t-.7-.137q.725-.8 1.113-1.775T12 8q0-1.05-.388-2.025T10.6 4.2q.35-.125.7-.163T12 4q1.65 0 2.825 1.175T16 8Z" />
                            </svg>
                            <span className="text-sm">Team Request</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12Zm-8 8v-2.8q0-.85.438-1.563T5.6 14.55q1.55-.775 3.15-1.163T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20H4Z" />
                            </svg>
                            <span className="text-sm">Individual</span>
                        </>
                    )}
                </div>
                {isGroupRequest && (
                    <div className="flex space-x-1">
                        <Button variant="link" className="text-blue-600">
                            View Justification
                        </Button>
                        <div className="border rounded-md border-blue-900">
                            <Select defaultValue="">
                                <SelectTrigger className='outline-none border-none'>
                                    <SelectValue placeholder="Team Members" />
                                </SelectTrigger>
                                <SelectContent >
                                    {employees.map((employee, index) => (
                                        <SelectItem key={index} value={employee} disabled >
                                            {employee}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {isAdmin && status === Status.Pending && (
                    <div className="flex space-x-2">
                        <Button
                            disabled={loadingAction?.requestId === requestID && loadingAction?.action === "approve" || loadingAction?.requestId === requestID && loadingAction?.action === "reject"}
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-600"
                            onClick={() => handleApprove && handleApprove(requestID)}
                        >
                            {loadingAction?.requestId === requestID && loadingAction?.action === "approve" ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <span>Approve</span>
                            )}
                        </Button>
                        <Button
                            disabled={loadingAction?.requestId === requestID && loadingAction?.action === "reject" || loadingAction?.requestId === requestID && loadingAction?.action === "approve"}
                            variant="outline"
                            className={`text-red-600 border-red-600 hover:bg-red-50 hover:text-red-600"`}
                            onClick={() => handleReject && handleReject(requestID)}
                        >
                            {loadingAction?.requestId === requestID && loadingAction?.action === "reject" ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <span>Reject</span>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    )
}

const RequestedCoursesView = ({ selectedCategory }: { selectedCategory: string }) => {
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(true)
    const [coursesToDisplay, setCoursesToDisplay] = useState<RequestData[]>([])

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                setLoading(true)
                const userStr = JSON.parse(sessionStorage.getItem('user') || '{}')
                dispatch(setEmpDetails(userStr))
                const response = await axiosInstance.get(
                    `https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/CoursesRequest/Requests/Employee/${userStr?.employeeID}`
                )
                setCoursesToDisplay(response.data.data.sort((a: any, b: any) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()))
                console.log(response.data.data)
            } catch (error) {
                console.error("Error fetching course details:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCourseDetails()
    }, [dispatch])

    const getCoursesForCategory = (): RequestData[] => {
        return coursesToDisplay.filter(course =>
            course.status === Status.Pending || course.status === Status.Rejected
        )
    }

    const filteredCourses = getCoursesForCategory()
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">
                {selectedCategory}
                <span className="text-base text-gray-500 ml-2">
                    ({filteredCourses.length})
                </span>
            </h2>

            {loading ? (
                <CardSkimmer />
            ) : filteredCourses.length === 0 ? (
                <div className="text-center p-8 border rounded-lg bg-muted">
                    <p className="text-muted-foreground">No pending requests found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {filteredCourses.map((course, index) => (
                        <RequestCard key={index} data={course} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default RequestedCoursesView