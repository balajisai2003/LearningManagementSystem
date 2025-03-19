import { configureStore } from "@reduxjs/toolkit"
import employeeDataSlice from "../features/employeeDataSlice";

export const store = configureStore({
    reducer: {
        employeeDataSlice: employeeDataSlice
    }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>