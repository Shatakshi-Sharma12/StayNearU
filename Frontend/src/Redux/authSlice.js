import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:null,
        token:null,
        location:"",
        loading:false,
    },reducers:{
        setUser:(state,action)=>{
            state.user=action.payload.user;
            state.token=action.payload.token;
        },
        setLocation:(state,action)=>{
            state.location=action.payload;
        },
        setLoading:(state,action)=>{
            state.loading=action.payload;
        },
        clearAuth:(state)=>{
            state.user=null;
            state.token=null;
            state.location="";
            state.loading=false;
        }
    }
})

export const {setUser,setLoading,clearAuth,setLocation}=authSlice.actions;
export default authSlice.reducer;