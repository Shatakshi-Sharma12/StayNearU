import { createSlice } from "@reduxjs/toolkit";

const initialState={
    pgs:[],
    totalEarning:0,
}

export const pgSliceAdmin=createSlice({
    name:'pg',
    initialState,
    reducers:{
        setList:(state,action)=>{
            state.pgs=action.payload;
        },
        setPgs:(state)=>{
            state.pgs=[];
        }
    }
})

export const {setList,setPgs}=pgSliceAdmin.actions;
export default pgSliceAdmin.reducer;