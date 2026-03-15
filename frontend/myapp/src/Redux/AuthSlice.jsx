import axiosInstance from "../Helper/Helper";
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

const initialState={
    status:"",
    isInRegistration:false,
    isLoggedIn:false,
    redirectlogin:null,
    redirectHome:null
}

export const register=createAsyncThunk(
    "register",
    async(formData)=>{
        let res=await axiosInstance.post("/patisent-Register",formData)
        return res.data
    }
)
export const login=createAsyncThunk(
    "login",
    async(formData)=>{
        let res=await axiosInstance.post("/patisent-Login",formData)
        return res.data
    }
)

export const AuthSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{

        resetRedirectLogin(state){
            state.redirectlogin=null
        },
        resetRedirectHome(state){
            state.redirectHome=null
        },
        // checkToken(state){
        //     const token=localStorage.getItem("token")
        //     if(token){
        //         state.isLoggedIn=true
        //     }
        // },
        // AuthSlice.js mein ye update karein
        checkToken(state) {
            const token = localStorage.getItem("token");
            if (token) {
                state.isLoggedIn = true;
            } else {
                state.isLoggedIn = false;
            }
        },
        logout(state){
            localStorage.clear()
            state.isLoggedIn=false
        }


    },
    extraReducers:(builder)=>{
        builder
        .addCase(register.fulfilled,(state,{payload})=>{
            state.status="success",
            localStorage.setItem("name",payload?.data?.name)
            state.isInRegistration=true,
            state.redirectlogin="/login"
        })
        .addCase(login.fulfilled,(state,{payload})=>{
            state.status="success",
            localStorage.setItem("token",payload?.token)
            localStorage.setItem("name",payload?.user?.name)
            localStorage.setItem("email",payload?.user?.email)
            localStorage.setItem("image",payload?.user?.image)
            state.isLoggedIn=true,
            state.redirectHome="/"
        })
    }
})
export const {resetRedirectHome,resetRedirectLogin,checkToken,logout}=AuthSlice.actions