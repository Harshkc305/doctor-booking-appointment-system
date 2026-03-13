import axiosInstance from "../Helper/helper";

import {createAsyncThunk,createSlice} from "@reduxjs/toolkit"

const initialState={
    status:"",
    doctors:[],

}

export const AllDoctors=createAsyncThunk(
    "doctor",
    async ()=>{
        let res=await axiosInstance.get("/getAllDoctor")
        return res.data;
    }
)

export const DoctorSlice=createSlice({
    name:"doctor",
    initialState,
    reducers:{},

    extraReducers:(builder)=>{
        builder

        .addCase(AllDoctors.fulfilled,(state,{payload})=>{
            state.status="success";
            state.doctors=payload.data;
        })

        .addCase(AllDoctors.pending,(state)=>{
            state.status="pending"
        })
        .addCase(AllDoctors.rejected,(state)=>{
            state.status="rejected"
        })
    }
})