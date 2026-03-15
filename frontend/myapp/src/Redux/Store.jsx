import { configureStore } from "@reduxjs/toolkit";
import { DoctorSlice } from "./DoctorSlice";
import { AuthSlice } from "./AuthSlice";

export const store=configureStore({
    reducer:{
        doctor:DoctorSlice.reducer,
        auth:AuthSlice.reducer
    }
})