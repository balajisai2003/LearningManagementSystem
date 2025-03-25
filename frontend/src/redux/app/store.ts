import { configureStore } from "@reduxjs/toolkit"
import employeeDataSlice from "../features/employeeDataSlice";
import lndDataSlice from "../features/lndDataSlice";

export const store = configureStore({
    reducer: {
        employeeDataSlice: employeeDataSlice,
        lndDataSlice: lndDataSlice,
    }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>