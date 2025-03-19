import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for the state
interface EmployeeDetails {
    empId: number;
}

interface CourseDetails {
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
}

export interface Course {
    progressID: number;
    employeeID: number;
    courseID: number;
    status: "In Progress" | "Completed" | "Not Started";
    lastUpdated: string; // ISO date string
    startDate: string; // ISO date string
    endDate: string | null; // ISO date string or null
    newOrReUsed: "New" | "Reused";
    monthCompleted: string | null; // ISO date string or null
    courseDetails: CourseDetails;
}

interface EmployeeDataState {
    empDetails: EmployeeDetails;
    courses: Course[];
}

// Define the initial state with types
const initialState: EmployeeDataState = {
    empDetails: {
        empId: 1001,
    },
    courses: [],
};

// Create the slice with typed state and actions
const employeeDataSlice = createSlice({
    name: "employeeData",
    initialState,
    reducers: {
        setEmpDetails: (state, action: PayloadAction<EmployeeDetails>) => {
            state.empDetails = action.payload;
        },
        addCourse: (state, action: PayloadAction<Course>) => {
            state.courses.push(action.payload);
        },
        addCourses: (state, action: PayloadAction<Course[]>) => {
            const courses = action.payload;
            state.courses = courses;
        },
        removeCourse: (state, action: PayloadAction<number>) => {
            state.courses = state.courses.filter(course => course.progressID !== action.payload);
        },
        resetEmployeeData: (state) => {
            state.empDetails = initialState.empDetails;
            state.courses = [];
        },
    },
});

// Export the actions with proper typing
export const { setEmpDetails, addCourse, removeCourse, resetEmployeeData, addCourses } = employeeDataSlice.actions;

// Export the reducer
export default employeeDataSlice.reducer;