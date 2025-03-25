"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import { toast } from "sonner"
import { trainingGroup } from "@/lib/trainingGroup"
import { TrainingMode } from "@/lib/trainingMode"

const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    category: z.string().min(1, "Category is required"),
    trainingMode: z.string().min(1, "Training mode is required"),
    trainingSource: z.string().min(1, "Training source is required"),
    durationInWeeks: z.number().min(1, "Must be at least 1 week"),
    durationInHours: z.number().min(1, "Must be at least 1 hour"),
    price: z.number().min(0, "Price cannot be negative"),
    skills: z.string().min(1, "Skills are required"),
    points: z.number().min(0, "Points cannot be negative"),
    resourceLink: z.string().url("Invalid URL format"),
})



const CourseForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
            trainingMode: "",
            trainingSource: "",
            durationInWeeks: 0,
            durationInHours: 0,
            price: 0,
            skills: "",
            points: 0,
            resourceLink: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axiosInstance.post(
                "https://learningmanagementsystemhw-azc0a4fmgre6cabn.westus3-01.azurewebsites.net/api/Courses/add",
                values
            )

            toast.success("Course created successfully")
            form.reset()
        } catch {
            toast.error("Error creating course")
        }
    }

    return (
        <Card className="p-6 max-w-3xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter course title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Category - Select Dropdown */}
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {trainingGroup.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Training Mode - Select Dropdown */}
                        <FormField
                            control={form.control}
                            name="trainingMode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Training Mode</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select training mode" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {TrainingMode.map((mode) => (
                                                <SelectItem key={mode} value={mode}>
                                                    {mode}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Training Source */}
                        <FormField
                            control={form.control}
                            name="trainingSource"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Training Source</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter training source" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Duration */}
                        <FormField
                            control={form.control}
                            name="durationInWeeks"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration (Weeks)</FormLabel>
                                    <FormControl>
                                        <Input

                                            {...field}
                                            onChange={e => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="durationInHours"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration (Hours)</FormLabel>
                                    <FormControl>
                                        <Input

                                            {...field}
                                            onChange={e => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Price */}
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price ($)</FormLabel>
                                    <FormControl>
                                        <Input

                                            {...field}
                                            onChange={e => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Points */}
                        <FormField
                            control={form.control}
                            name="points"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Learning Points</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={e => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Resource Link */}
                        <FormField
                            control={form.control}
                            name="resourceLink"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Resource URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Skills */}
                        <FormField
                            control={form.control}
                            name="skills"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Skills</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Comma-separated skills" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Detailed course description"
                                            {...field}
                                            className="min-h-[120px]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Course...
                            </>
                        ) : (
                            "Create New Course"
                        )}
                    </Button>
                </form>
            </Form>
        </Card>
    )
}

export default CourseForm