import express from "express";
import cors from 'cors'
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import 'dotenv/config'
import path from "path";
import { fileURLToPath } from "url";
import pgAdminRouter from "./routes/pgAdminRoutes.js";
import pgUserRouter from "./routes/pgUserRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
// import reviewRouter from "./routes/reviewRoutes.js";
import "./cronJobs.js"

const app=express();

const corsOptions={
    origin:'http://localhost:5173',
    credentials:true,
}
// middleware
app.use(express.json());
app.use(cors(corsOptions))

// Database connection made
connectDB();

// api
app.use('/auth',userRouter)
app.use('/admin',pgAdminRouter);
app.use('/user',pgUserRouter);
// app.use("",reviewRouter)
app.use('/profile',profileRouter);
app.use("/profile",express.static('uploads/profile'))
app.use("/aadhar",express.static('uploads/profile'))
app.use("/pg",express.static('uploads/pg'))
app.use("/make",paymentRouter)
app.use("/booking",bookingRouter);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
 res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


app.get('/',(req,res)=>{
    res.send("Hello World!")
})

const port=process.env.PORT || 8080
app.listen(port,()=>{
    console.log(`Server connected at ${port}`)
})
