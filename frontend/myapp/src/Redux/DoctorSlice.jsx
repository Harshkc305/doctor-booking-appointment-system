import axiosInstance from "../Helper/Helper"

import {createAsyncThunk,createSlice} from "@reduxjs/toolkit"

const initialState={
    status:"",
    doctors:[],
    specialization:[],
    totalPage:1,
    currentPage:1,


}

export const AllDoctors=createAsyncThunk(
    "doctor",
    async ({search="",specialization="",page=1})=>{
        let res=await axiosInstance.get("/getAllDoctor",{
            params:{
                search,
                specialization,
                page,
                limit:10
            }
        })
        return res.data;
    }
)

export const fetchSpecialization=createAsyncThunk(
    "allseccialization",
    async()=>{
        const res=await axiosInstance.get("/AllSpecialization")
        return res.data
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
            state.totalPage=payload.totalPages;
            state.currentPage=payload.currentPage
        })

        .addCase(AllDoctors.pending,(state)=>{
            state.status="pending"
        })
        .addCase(AllDoctors.rejected,(state)=>{
            state.status="rejected"
        })

        .addCase(fetchSpecialization.fulfilled,(state,{payload})=>{
            state.status+"success",
            state.specialization=payload.data;
        })
    }
})