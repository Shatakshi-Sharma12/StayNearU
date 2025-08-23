import express from "express";
import { forgotPassword, login, logout, resendOtp, resetPassword, signup, verifyOtp } from "../controllers/userController.js";


const userRouter=express.Router();

userRouter.post('/signup',signup);
userRouter.post('/verify-otp', verifyOtp)
userRouter.post('/verify-otp/resend', resendOtp)
userRouter.post('/login',login)
userRouter.post('/forgot',forgotPassword)
userRouter.post('/reset-password/:token',resetPassword)
userRouter.post('/logout',logout)


export default userRouter;