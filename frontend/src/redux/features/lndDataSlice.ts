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

export interface Requests {
    requestID: number;
    employeeID: number;
    courseID: number;
    status: "Started" | "Completed" | "Not Started" | "Pending";
    lastUpdated: string; // ISO date string
    startDate: string; // ISO date string
    endDate: string | null; // ISO date string or null
    newOrReUsed: "New" | "Reused";
    monthCompleted: string | null; // ISO date string or null
    courseDetails: CourseDetails;
}

interface lndDataSlice {
    empDetails: EmployeeDetails;
    requests: Requests[];
}

// Define the initial state with types
const initialState: lndDataSlice = {
    empDetails: {
        empId: 1001,
    },
    requests: [],
};

// Create the slice with typed state and actions
const employeeDataSlice = createSlice({
    name: "employeeData",
    initialState,
    reducers: {
        setEmpDetails: (state, action: PayloadAction<EmployeeDetails>) => {
            state.empDetails = action.payload;
        },
        addRequest: (state, action: PayloadAction<Requests>) => {
            state.requests.push(action.payload);
        },
        addRequests: (state, action: PayloadAction<Requests[]>) => {
            const requests = action.payload;
            state.requests = requests;
        },
        removeCourse: (state, action: PayloadAction<number>) => {
            state.requests = state.requests.filter(Requests => Requests.requestID !== action.payload);
        },
        resetEmployeeData: (state) => {
            state.empDetails = initialState.empDetails;
            state.requests = [];
        },
    },
});

// Export the actions with proper typing
export const { setEmpDetails, addRequest, removeCourse, resetEmployeeData, addRequests } = employeeDataSlice.actions;

// Export the reducer
export default employeeDataSlice.reducer;