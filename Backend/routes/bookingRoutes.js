import express from "express";
import { createBooking, getAdminBookings, getBookings, getRecentBooking } from "../controllers/bookingController.js";

const bookingRouter=express.Router();

bookingRouter.post('/create',createBooking);
bookingRouter.get('/get',getBookings);
bookingRouter.get('/admin/:id',getAdminBookings);
bookingRouter.get('/getRecent',getRecentBooking);

export default bookingRouter;