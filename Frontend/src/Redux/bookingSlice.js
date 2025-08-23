import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    bookingData:{
        room:null,
        months: '',
        transactionId: null,
        amount:'',
        profile:null,
        pgId: null,
        roomId:null,
        contractPeriod:'',
        userId: null,
        status: 'pending', // 'pending' or 'completed'
    }
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setBookingData: (state, action) => {
            state.bookingData=action.payload;
        },
        finalizeBooking: (state, action) => {
            state.bookingData.status = 'completed'; // Update the booking status
            state.bookingData.transactionId = action.payload.transactionId;
            state.bookingData.userId=action.payload.userId;
        },
        resetBooking: (state) => {
            state.bookingData = initialState.bookingData;
        },
    },
});

export const { setBookingData, finalizeBooking, resetBooking } = bookingSlice.actions;

export default bookingSlice.reducer;
