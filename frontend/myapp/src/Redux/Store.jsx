import { configureStore } from "@reduxjs/toolkit";
import { DoctorSlice } from "./DoctorSlice";


export const store=configureStore({
    reducer:{
        doctor:DoctorSlice.reducer,
    }
})