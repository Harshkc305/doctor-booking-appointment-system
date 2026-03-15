import axiosInstance from "../Helper/Helper"

import {createAsyncThunk,createSlice} from "@reduxjs/toolkit"

const initialState={
    status:"",
    doctors:[],
    singleDoctor:{},
    specialization:[],
    totalPage:1,
    currentPage:1,
    myBookings:[]


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

export const fetchsingleDoctor = createAsyncThunk(
  "singleDoctor",
  async (id) => {
    const res = await axiosInstance.get(`/SingleDoctor/${id}`);
    return res.data;
  }
);

// Booking create karne ke liye (Razorpay Order mangwane ke liye)
export const createBooking = createAsyncThunk(
    "doctor/createBooking",
    async (bookingData, { rejectWithValue }) => {
        try {
            // Note: Booking ke liye POST request use karein
            const res = await axiosInstance.post("/createBooking", bookingData);
            return res.data; 
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Payment verify karne ke liye
export const verifyPaymentAction = createAsyncThunk(
    "doctor/verifyPayment",
    async (paymentDetails, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/verifyPayment", paymentDetails);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchMyBookings=createAsyncThunk(
    "doctor/bookings",
    async()=>{
        const res=await axiosInstance.get("/my-bookings")
        return res.data
    }
)

export const cancelBookingAction = createAsyncThunk(
    "doctor/cancelBooking",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/cancel-booking/${id}`);
            // Hum id ko return kar rahe hain taaki extraReducer mein use pehchan sakein
            return { id, message: res.data.message }; 
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const DoctorSlice=createSlice({
    name:"doctor",
    initialState,
    reducers:{},

    extraReducers:(builder)=>{
        builder

        .addCase(AllDoctors.fulfilled, (state, { payload }) => {
            state.status = "success";
            state.doctors = payload.data;
            state.totalPage = payload.totalPage; // Backend key check karein (singular/plural)
            state.currentPage = payload.currentPage;
})

        .addCase(AllDoctors.pending,(state)=>{
            state.status="pending"
        })
        .addCase(AllDoctors.rejected,(state)=>{
            state.status="rejected"
        })

        .addCase(fetchSpecialization.fulfilled,(state,{payload})=>{
            state.status = "success";
            state.specialization=payload.data;
        })

        .addCase(fetchsingleDoctor.fulfilled,(state,{payload})=>{
            state.singleDoctor = payload.data;
        })

        .addCase(createBooking.pending, (state) => {
            state.status = "loading";
        })
        .addCase(createBooking.fulfilled, (state, { payload }) => {
            state.status = "success";
            // Agar aapko bookings list maintain karni hai toh:
            // state.myBookings.push(payload.order); 
        })
        .addCase(createBooking.rejected, (state) => {
            state.status = "failed";
        })

        .addCase(fetchMyBookings.fulfilled, (state, { payload }) => {
            state.myBookings = payload.data;
        })

        .addCase(cancelBookingAction.fulfilled, (state, { payload }) => {
            // Yahan payload.id wahi hai jo humne action se return kiya
            state.myBookings = state.myBookings.map(item => 
                item._id === payload.id ? { ...item, status: 'cancelled' } : item
            );
        })
        


    }
})