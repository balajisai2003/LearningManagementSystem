"use client";
import React, { useEffect, useState } from "react";
import CardSkimmer from "@/components/CardSkimmer";
import { RequestCard } from "@/components/employee-components/RequestedCoursesView";
import axiosInstance from "@/lib/axiosInstance";
import { useAppDispatch, useAppSelector } from "@/redux/app/hooks";
import { addRequests, Requests } from "@/redux/features/lndDataSlice";
import { Status } from "@/types/Status";
import { toast } from "sonner";

type LoadingAction = {
    requestId: number;
    action: "approve" | "reject";
} | null;

const TrainingRequests = () => {
    const dispatch = useAppDispatch();
    const [trainingRequests, setTrainingRequests] = useState<any[]>([]);
    const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
    const { requests } = useAppSelector((state) => state.lndDataSlice);
    const [filter, setFilter] = useState<string>("");
    const tabs = ["All", "Pending", "Approved", "Rejected"];
    const [activeTab, setActiveTab] = useState<string>("All");
    const [loading, setLoading] = useState<boolean>(false);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
    };

    const filteredRequests = trainingRequests.filter((request) =>
        request?.requestID?.toString().includes(filter) ||
        request?.courseDetails?.title?.toLowerCase().includes(filter)
    );

    const handleApprove = async (requestId: number) => {
        setLoadingAction({ requestId, action: "approve" });
        try {
            const response = await axiosInstance.patch(
                `https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/CoursesRequest/Approve/${requestId}?newOrReused=new`
            );
            if (response.status === 200) {
                const updatedRequests = requests.map((request) =>
                    request.requestID === requestId
                        ? { ...request, status: Status.Approved }
                        : request
                );
                dispatch(addRequests(updatedRequests as Requests[]));
                setTrainingRequests(updatedRequests);
            }
            toast.success("Request approved successfully");
        } catch (error) {
            console.error("Error approving request:", error);
            toast.error("Error approving request");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleReject = async (requestId: number) => {
        setLoadingAction({ requestId, action: "reject" });
        try {
            const response = await axiosInstance.patch(
                `https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/CoursesRequest/Reject/${requestId}`
            );
            if (response.status === 200) {
                const updatedRequests = requests.map((request) =>
                    request.requestID === requestId
                        ? { ...request, status: Status.Rejected }
                        : request
                );
                dispatch(addRequests(updatedRequests as Requests[]));
                setTrainingRequests(updatedRequests);
            }
            toast.success("Request rejected successfully");

        } catch (error) {
            console.error("Error rejecting request:", error);
            toast.error("Error rejecting request");
        } finally {
            setLoadingAction(null);
        }
    };

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true)
                const response = await axiosInstance.get(
                    "https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/CoursesRequest/Requests"
                );
                if (response.status === 200) {
                    const sortedRequests = response.data.data.sort(
                        (a: any, b: any) =>
                            new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
                    );
                    setTrainingRequests(sortedRequests);
                    dispatch(addRequests(sortedRequests));
                }
            } catch (error) {
                console.error("Error fetching training requests:", error);
            }
            finally {
                setLoading(false)
            }
        };

        // Only update if the redux requests array length differs from local state
        if (requests.length > 0 && requests.length !== trainingRequests.length) {
            setTrainingRequests(requests);
        } else if (requests.length === 0) {
            fetchRequests();
        }
        // We omit trainingRequests from dependencies to prevent extra updates.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requests, dispatch]);

    const filterRequestsByTabs = (tab: string) => {
        return filteredRequests.filter((request: any) => {
            if (tab === "All") return true;
            if (tab === Status.Pending) return request.status === Status.Pending;
            if (tab === Status.Approved) return request.status === Status.Approved;
            if (tab === Status.Rejected) return request.status === Status.Rejected;
            return false;
        });
    };

    const tabBasedFilteredData = filterRequestsByTabs(activeTab);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Training Requests</h1>
            <div className="mb-4 flex space-x-6">
                <input
                    type="text"
                    value={filter}
                    onChange={handleFilterChange}
                    placeholder="Filter by Request ID / Course Title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600 text-lg">Total Requests:</span>
                    <span className="bg-blue-100 text-blue-800 font-semibold rounded-md p-4 w-[150px] text-center text-2xl border border-blue-300">
                        {tabBasedFilteredData.length}
                    </span>
                </div>
            </div>
            <div className="flex space-x-4 my-4">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-md ${activeTab === tab ? "bg-primary text-white" : "bg-gray-200 text-gray-800"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {loading ? (
                    <CardSkimmer />
                ) : tabBasedFilteredData.length > 0 ? (
                    tabBasedFilteredData.map((request: any, index) => (
                        <RequestCard
                            key={index}
                            data={request}
                            isAdmin={true}
                            handleApprove={handleApprove}
                            handleReject={handleReject}
                            loadingAction={loadingAction}
                        />
                    ))
                ) :
                    <p className="text-center text-gray-500 col-span-full text-2xl">
                        No training requests found.
                    </p>

                }
            </div>
        </div>
    );
};

export default TrainingRequests;
