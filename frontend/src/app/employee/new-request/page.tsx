'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import dynamic from 'next/dynamic';
import { Props as SelectProps } from 'react-select';

const ReactSelect = dynamic<SelectProps>(() => import('react-select'), { ssr: false });

type ParticipantOption = { label: string; value: string; };
type TagOption = { label: string; value: string; };

type FormData = {
    employeeId: string;
    reportingManager: string;
    employeeRole: string;
    techGroup: string;

    requestType: string;

    brownBagDate?: Date;
    brownBagPresentationTopic: string;
    brownBagDescription: string;

    trainingMode: string;
    trainingType: string;
    subDomain: string;
    trainingSource: string;
    trainingTopic: string;
    otherTrainingTopic: string;
    participants: ParticipantOption[];
    justificationFile?: File;
    tags: TagOption[];
};

const participantOptions: ParticipantOption[] = [
    { value: 'john-doe', label: 'John Doe' },
    { value: 'jane-smith', label: 'Jane Smith' },
    { value: 'team-alpha', label: 'Team Alpha' },
];

const tagOptions: TagOption[] = [
    { value: 'technical', label: 'Technical' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'soft-skills', label: 'Soft Skills' },
];

const topicOptions = [
    { value: 'react', label: 'React Advanced' },
    { value: 'typescript', label: 'TypeScript Fundamentals' },
    { value: 'leadership', label: 'Leadership Skills' },
    { value: 'other', label: 'Other' },
];

const subDomainOptions: { [key: string]: { value: string; label: string }[] } = {
    technical: [
        { value: 'data-ai', label: 'Data & AI' },
        { value: 'app-dev', label: 'App Development' },
        { value: 'infra-devops', label: 'Infra & DevOps' },
        { value: 'frontend', label: 'Frontend' },
        { value: 'fullstack', label: 'Full Stack' },
    ],
    softskills: [
        { value: 'communication', label: 'Communication' },
        { value: 'presentation', label: 'Presentation' },
    ],
    domain: [
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'retail', label: 'Retail' },
        { value: 'bfsi', label: 'BFSI' },
    ],
    managerial: [
        { value: 'project-management', label: 'Project Management' },
        { value: 'resource-planning', label: 'Resource Planning' },
    ],
    leadership: [
        { value: 'strategic-thinking', label: 'Strategic Thinking' },
        { value: 'team-building', label: 'Team Building' },
    ],
};


const TrainingRequestForm = () => {
    const [formData, setFormData] = useState<FormData>({
        employeeId: '',
        reportingManager: '',
        employeeRole: '',
        techGroup: '',

        requestType: '',

        brownBagDate: undefined,
        brownBagPresentationTopic: '',
        brownBagDescription: '',
        trainingMode: '',
        trainingType: '',
        trainingSource: '',
        trainingTopic: '',
        otherTrainingTopic: '',
        subDomain: '',
        participants: [],
        justificationFile: undefined,
        tags: [],
    });

    const handleChange = (field: keyof FormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        if (field === "trainingType") {
            setFormData(prev => ({
                ...prev,
                ["subDomain"]: ""
            }))
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.requestType) {
            alert('Please select a request type.');
            return;
        }

        const payload = {
            ...formData,
            participants: formData.participants.map(p => p.label),
            tags: formData.tags.map(t => t.label),
            trainingTopic:
                formData.trainingTopic === 'other'
                    ? formData.otherTrainingTopic
                    : topicOptions.find(t => t.value === formData.trainingTopic)?.label,
        };

        console.log('Submitting Form Data:', payload);
    };

    const isBulkRequest = formData.participants.length > 1;
    const isFriday = (date: Date) => date.getDay() === 5;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-primary mb-8">Training / Brown Bag Request</h1>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Employee Info (Always Visible) */}
                <Card>
                    <CardHeader className="bg-indigo-50">
                        <CardTitle className="text-primary">Employee Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <Label>Employee ID *</Label>
                            <Input
                                placeholder="Enter Employee ID"
                                value={formData.employeeId}
                                onChange={e => handleChange('employeeId', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Reporting Manager *</Label>
                            <Input
                                placeholder="Enter Reporting Manager"
                                value={formData.reportingManager}
                                onChange={e => handleChange('reportingManager', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Designation</Label>
                            <Input
                                placeholder="Enter Role"
                                value={formData.employeeRole}
                                onChange={e => handleChange('employeeRole', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Tech Group</Label>
                            <Select
                                value={formData.techGroup}
                                onValueChange={v => handleChange('techGroup', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Tech Group" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="app-dev">App Dev</SelectItem>
                                    <SelectItem value="testing">Testing</SelectItem>
                                    <SelectItem value="data-ai">Data AI</SelectItem>
                                    <SelectItem value="business-analyst">Business Analyst</SelectItem>
                                </SelectContent>
                            </Select>
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
                                            <SelectItem value="instructor-led-trainer">Instructor-led (Trainer Enabled)</SelectItem>
                                            <SelectItem value="self-learning">Self learning (E-Learning)</SelectItem>
                                            <SelectItem value="winwire-recordings">Self learning (Winwire Recordings)</SelectItem>
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
                                            <SelectItem value="technical">Technical</SelectItem>
                                            <SelectItem value="softskills">Softskills</SelectItem>
                                            <SelectItem value="domain">Domain</SelectItem>
                                            <SelectItem value="managerial">Managerial</SelectItem>
                                            <SelectItem value="leadership">Leadership</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {formData.trainingType && (
                                <div>
                                    <Label>Sub Domain</Label>
                                    <Select
                                        value={formData.subDomain || ''}
                                        onValueChange={(v) => handleChange('subDomain', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Sub Domain" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subDomainOptions[formData.trainingType]?.map((sd) => (
                                                <SelectItem key={sd.value} value={sd.value}>
                                                    {sd.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div>
                                <Label>Training Topic *</Label>
                                <Select
                                    value={formData.trainingTopic}
                                    onValueChange={v => handleChange('trainingTopic', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Training Topic" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {topicOptions.map(topic => (
                                            <SelectItem key={topic.value} value={topic.value}>
                                                {topic.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.trainingTopic === 'other' && (
                                <>
                                    <div>
                                        <Label>Other Training Topic *</Label>
                                        <Input
                                            placeholder="Enter Custom Topic"
                                            value={formData.otherTrainingTopic}
                                            onChange={e => handleChange('otherTrainingTopic', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Tags / Skills</Label>
                                        <ReactSelect
                                            isMulti
                                            options={tagOptions}
                                            value={formData.tags}
                                            onChange={(newValue: unknown) => handleChange('tags', newValue as TagOption[] || [])}
                                            placeholder="Select Skills"
                                        />
                                    </div>

                                </>
                            )}

                            <div>
                                <Label>Participants</Label>
                                <ReactSelect
                                    isMulti
                                    options={participantOptions}
                                    value={formData.participants}
                                    onChange={(newValue: unknown) => handleChange('participants', newValue as ParticipantOption[] || [])}
                                    placeholder="Select Participants"
                                />
                            </div>

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
                            <div>
                                <Label>Presentation Topic *</Label>
                                <Input
                                    placeholder="Enter Presentation Topic"
                                    value={formData.brownBagPresentationTopic}
                                    onChange={e => handleChange('brownBagPresentationTopic', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Description *</Label>
                                <Textarea
                                    placeholder="Provide a brief description of your presentation"
                                    value={formData.brownBagDescription}
                                    onChange={e => handleChange('brownBagDescription', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Session Date (Fridays Only)</Label>
                                <Calendar
                                    mode="single"
                                    selected={formData.brownBagDate}
                                    onSelect={d => handleChange('brownBagDate', d)}
                                    disabled={date => !isFriday(date)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Submit / Cancel Buttons */}
                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline">Cancel</Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        Submit Request
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default TrainingRequestForm;
