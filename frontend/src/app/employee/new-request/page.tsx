"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import dynamic from 'next/dynamic';
import { Props as SelectProps } from 'react-select';
import axiosInstance from '@/lib/axiosInstance';
import Loader from '@/components/Loader';
import { useSessionStorage } from '@/hooks/useSessionStorage';
import { Status } from '@/types/Status';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { TrainingMode } from '@/lib/trainingMode';
import { trainingGroup } from '@/lib/trainingGroup';

const ReactSelect = dynamic<SelectProps>(() => import('react-select'), { ssr: false });

type ParticipantOption = { label: string; value: string; };
type TagOption = { label: string; value: string; };

type FormData = {
    employeeId: string;
    name: string;
    employeeRole: string;
    techGroup: string;
    requestType: string;
    brownBagDate?: Date;
    brownBagTopicType: string;
    brownBagSpeakerWriteUp: string;
    brownBagPresentationTopic: string;
    brownBagDescription: string;
    trainingMode: string;
    trainingType: string;
    trainingSource: string;
    trainingTopic: string | any;
    otherTrainingTopic: string;
    participants: ParticipantOption[];
    justificationFile?: File;
    tags: TagOption[];
};

type Course = {
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
};


const TrainingRequestForm = () => {
    const [formData, setFormData] = useState<FormData>({
        employeeId: '',
        name: '',
        employeeRole: '',
        techGroup: '',
        requestType: '',
        brownBagDate: new Date(),
        brownBagTopicType: '',
        brownBagSpeakerWriteUp: '',
        brownBagPresentationTopic: '',
        brownBagDescription: '',
        trainingMode: '',
        trainingType: '',
        trainingSource: '',
        trainingTopic: '',
        otherTrainingTopic: '',
        participants: [],
        justificationFile: undefined,
        tags: [],
    });

    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false)
    const userDetails = useSessionStorage("user")
    const [employeesData, setEmployeesData] = useState<any[]>([])
    const [fieldValue, setFieldValue] = useState(false)
    // Fetch courses from API
    useEffect(() => {
        setFormData((prev) => ({
            ...prev, employeeId: userDetails?.employeeID, employeeRole: userDetails?.designation, techGroup: userDetails?.techGroup, name: userDetails?.name
        }))
        const fetchCourses = async () => {
            try {
                setLoading(true)
                const response = await axiosInstance.get("https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/Courses/AllCourses");

                const employeesResponse = await axiosInstance.get('https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/Employee/AllEmployees');
                const employees = await employeesResponse.data.data;
                setEmployeesData(employees.map((emp: any) => ({ value: emp.employeeID, label: `${emp.name}-${emp.employeeID}` })))
                const courses = await response.data.data;

                if (courses) {
                    setCourses(courses);
                    setFilteredCourses(courses); // Initially show all courses
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
            finally {
                setLoading(false)
            }
        };

        fetchCourses();
    }, [userDetails]);

    // Filter courses based on form data
    useEffect(() => {
        let filtered = courses;

        if (formData.trainingMode) {
            filtered = filtered.filter(course =>
                course.trainingMode.toLowerCase().includes(formData.trainingMode.toLowerCase())
            );
        }

        if (formData.trainingType) {
            filtered = filtered.filter(course =>
                course.category.toLowerCase().includes(formData.trainingType.toLowerCase())
            );
        }
        const formatedCourses = filtered.map(course => ({ value: course?.courseID, label: course?.title }))
        setFilteredCourses([...formatedCourses, { value: -1, label: "Other" }]);

    }, [formData, courses]);


    const handleChange = (field: keyof FormData, value: any) => {
        if (field === "trainingTopic" || field === "brownBagPresentationTopic") {
            setFormData(prev => ({
                ...prev,
                [field]: value,
            }));
        }
        else {
            setFormData(prev => ({
                ...prev,
                [field]: value,
            }));

        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.requestType) {
            alert('Please select a request type.');
            return;
        }

        const payload = {
            ...formData,
            participants: formData.participants.map(p => p.label),
            tags: formData.tags.map(t => t.label),
            trainingTopic: formData.trainingTopic?.value
        };

        try {
            setLoading(true);

            if (payload.requestType === "training") {
                // Handle training request submission
                if (payload.participants.length < 1) {
                    // Single participant request
                    await axiosInstance.post('https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/CoursesRequest/create', {
                        employeeID: formData.employeeId,
                        courseID: formData.trainingTopic?.value,
                        requestEmpIDs: formData.employeeId.toString(),
                        requestDate: new Date().toISOString(),
                        status: Status.Pending,
                        comments: formData.otherTrainingTopic || "",
                        imageLink: formData.justificationFile ? URL.createObjectURL(formData.justificationFile) : ""
                    });
                } else {
                    // Bulk request with multiple participants
                    await axiosInstance.post('https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/CoursesRequest/create', {
                        employeeID: formData.employeeId,
                        courseID: formData.trainingTopic?.value,
                        requestEmpIDs: formData.participants.map(p => p.value).join(','),
                        requestDate: new Date().toISOString(),
                        status: Status.Pending,
                        comments: formData.otherTrainingTopic || "",
                        imageLink: formData.justificationFile ? URL.createObjectURL(formData.justificationFile) : ""
                    });
                }

                toast.success("Training request submitted successfully");

            } else if (payload.requestType === "brownBag") {
                // Handle brown bag session request submission
                const brownBagPayload = {
                    employeeID: formData.employeeId,
                    employeeName: formData.name,
                    topicType: formData.brownBagTopicType,
                    topicName: formData.brownBagPresentationTopic,
                    agenda: formData.brownBagDescription,
                    speakerDescription: formData.brownBagSpeakerWriteUp,
                    requestDate: new Date().toISOString(),
                };

                // Send Brown Bag session request
                await axiosInstance.post('https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/BrownBagRequest/create', brownBagPayload);

                toast.success("Brown Bag session request submitted successfully");
            }

        } catch (err) {
            console.error("Error submitting request:", err);
            toast.error("Error submitting request");
        } finally {
            setLoading(false);
        }

        clearForm();
    };

    const clearForm = () => {
        setFormData({
            ...formData,
            requestType: '',
            brownBagDate: undefined,
            brownBagTopicType: '',
            brownBagSpeakerWriteUp: '',
            brownBagPresentationTopic: '',
            brownBagDescription: '',
            trainingMode: '',
            trainingType: '',
            trainingSource: '',
            trainingTopic: '',
            otherTrainingTopic: '',
            participants: [],
            justificationFile: undefined,
            tags: [],
        });
        setFieldValue(false);
    }

    const isBulkRequest = formData.participants.length > 1;
    const isFriday = (date: Date) => date.getDay() === 5;

    const isBrownBagFieldsFilled = formData.brownBagTopicType.trim() !== '' &&
        formData.brownBagSpeakerWriteUp.trim() !== '' &&
        formData.brownBagPresentationTopic.trim() !== '' &&
        formData.brownBagDescription.trim() !== '' &&
        formData.brownBagDate !== undefined;

    const isTrainingFieldsFilled = formData.trainingMode.trim() !== '' &&
        formData.trainingType.trim() !== '' &&
        formData.trainingTopic !== '' &&
        (formData.trainingTopic?.value !== -1 || formData.otherTrainingTopic.trim() !== '');

    const isFormValid = formData.requestType === 'brownBag' ? isBrownBagFieldsFilled :
        formData.requestType === 'training' ? isTrainingFieldsFilled : false;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-primary mb-8">Training / Brown Bag Request</h1>

            <form onSubmit={handleSubmit} className="relative space-y-8">
                {/* Employee Info (Always Visible) */}
                <Card>
                    <CardHeader className="bg-indigo-50">
                        <CardTitle className="text-primary">Employee Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <Label>Employee ID *</Label>
                            <p className="text-gray-700 border border-gray-400 rounded-sm p-2">{formData.employeeId || "N/A"}</p>
                        </div>
                        <div>
                            <Label>Employee Name </Label>
                            <p className="text-gray-700 border border-gray-400 rounded-sm p-2">{formData.name || "N/A"}</p>
                        </div>
                        <div>
                            <Label>Designation</Label>
                            <p className="text-gray-700 border border-gray-400 rounded-sm p-2">{formData.employeeRole || "N/A"}</p>
                        </div>
                        <div>
                            <Label>Tech Group</Label>
                            <p className="text-gray-700 border border-gray-400 rounded-sm p-2">{formData.techGroup || "N/A"}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Request Type Radio Buttons */}
                <Card>
                    <CardHeader className="bg-indigo-50">
                        <CardTitle className="text-primary">Select Request Type</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4 mt-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="requestType"
                                value="training"
                                checked={formData.requestType === 'training'}
                                onChange={e => handleChange('requestType', e.target.value)}
                                className="h-4 w-4"
                            />
                            <span>Training Request</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="requestType"
                                value="brownBag"
                                checked={formData.requestType === 'brownBag'}
                                onChange={e => handleChange('requestType', e.target.value)}
                                className="h-4 w-4"
                            />
                            <span>Brown Bag Session</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Training Request Details */}
                {formData.requestType === 'training' && (
                    <Card>
                        <CardHeader className="bg-indigo-50">
                            <CardTitle className="text-primary">Training Request Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Training Mode</Label>
                                    <Select
                                        value={formData.trainingMode}
                                        onValueChange={v => handleChange('trainingMode', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Mode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                TrainingMode.map((mode, index) => (<SelectItem key={index} value={mode}>{mode}</SelectItem>))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Training Type</Label>
                                    <Select
                                        value={formData.trainingType}
                                        onValueChange={v => handleChange('trainingType', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                trainingGroup.map((mode, index) => (<SelectItem key={index} value={mode}>{mode}</SelectItem>))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {
                                formData.trainingMode && formData.trainingType && (
                                    <div>
                                        <Label>Training Topic *</Label>
                                        <ReactSelect
                                            isMulti={false}
                                            options={filteredCourses}
                                            value={formData.trainingTopic}
                                            onChange={(newValue) =>
                                                handleChange('trainingTopic', newValue) // Should be array of selected options
                                            }
                                            placeholder="Select Topic"
                                        />
                                    </div>
                                )
                            }

                            {formData.trainingTopic?.value == -1 && (
                                <>
                                    <div>
                                        <Label>Other Training Topic *</Label>
                                        <Input
                                            placeholder="Enter Custom Topic"
                                            value={formData.otherTrainingTopic}
                                            onChange={e => handleChange('otherTrainingTopic', e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                            {
                                formData.trainingMode && formData.trainingType && <div className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={fieldValue}
                                        onCheckedChange={(e) => setFieldValue(Boolean(e))}
                                    /> <label
                                        htmlFor="terms2"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Would you like to add participants?
                                    </label>
                                </div>
                            }
                            {
                                fieldValue && <div>
                                    <Label>Participants</Label>
                                    <ReactSelect
                                        isMulti
                                        options={employeesData}
                                        value={formData.participants}
                                        onChange={(newValue: unknown) => handleChange('participants', newValue as ParticipantOption[] || [])}
                                        placeholder="Select Participants"
                                    />
                                </div>
                            }

                            {isBulkRequest && (
                                <div>
                                    <Label>Justification Attachment (File)</Label>
                                    <Input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.png,.jpg"
                                        onChange={e => handleChange('justificationFile', e.target.files?.[0])}
                                    />
                                    {formData.justificationFile && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Attached: {formData.justificationFile.name}
                                        </p>
                                    )}
                                </div>
                            )}

                        </CardContent>
                    </Card>
                )}

                {/* Brown Bag Session Details */}
                {formData.requestType === 'brownBag' && (
                    <Card>
                        <CardHeader className="bg-indigo-50">
                            <CardTitle className="text-primary">Brown Bag Session Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 mt-4">
                            {/* Topic Type */}
                            <div>
                                <Label>Topic Type *</Label>
                                <Input
                                    value={formData.brownBagTopicType}
                                    onChange={e => handleChange('brownBagTopicType', e.target.value)}
                                />

                            </div>

                            {/* Topic Name */}
                            <div>
                                <Label>Topic Name *</Label>
                                <Input
                                    placeholder="Enter Topic Name"
                                    value={formData.brownBagPresentationTopic}
                                    onChange={e => handleChange('brownBagPresentationTopic', e.target.value)}
                                />
                            </div>

                            {/* Agenda */}
                            <div>
                                <Label>Agenda *</Label>
                                <Textarea
                                    placeholder="Provide the agenda for the session in 4 - 5 lines"
                                    value={formData.brownBagDescription}
                                    onChange={e => handleChange('brownBagDescription', e.target.value)}
                                />
                            </div>

                            {/* Speaker Write-up */}
                            <div>
                                <Label>Speaker Write-up *</Label>
                                <Textarea
                                    placeholder="Your Write Up in 4 - 5 lines"
                                    value={formData.brownBagSpeakerWriteUp}
                                    onChange={e => handleChange('brownBagSpeakerWriteUp', e.target.value)}
                                />
                            </div>

                            {/* Request Date (Fridays Only) */}
                            <div>
                                <Label>Session Date (Fridays Only)</Label>
                                <Calendar
                                    mode="single"
                                    selected={formData.brownBagDate}
                                    onSelect={d => handleChange('brownBagDate', d)}
                                    disabled={date => {
                                        const isFutureOrToday = date >= new Date(new Date().setHours(0, 0, 0, 0));
                                        return !isFriday(date) || !isFutureOrToday;
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}


                {/* Submit / Cancel Buttons */}
                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline">Cancel</Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={!isFormValid}>
                        Submit Request
                    </Button>
                </div>

            </form>
            {
                loading && <Loader />
            }

        </div>
    );
};

export default TrainingRequestForm;