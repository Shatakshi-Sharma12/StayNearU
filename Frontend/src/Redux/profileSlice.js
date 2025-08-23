import { createSlice } from "@reduxjs/toolkit";

const initialState={
    profile:{
        name: "",
        email:"",
        phone:"",
        age: "",
        gender: "",
        parent: "",
        address: "",
        photo:"",
        aadharCard:"",
        user:""
      }
}
const profileSlice=createSlice({
    name:"profile",
    initialState,
    reducers:{
        setProfileData: (state, action) => {
            state.profile=action.payload;
        },
        resetProfile: (state) => {
            state.profile = initialState.profile;
        },
    }
})

export const {setProfileData,resetProfile}=profileSlice.actions;
export default profileSlice.reducer;