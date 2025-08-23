import express from "express";
import { createOrUpdateProfile, getProfile } from "../controllers/profileController.js";
import multer from "multer";
const profileRouter=express.Router();

const storage = multer.diskStorage({
    destination:"uploads/profile",
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})
const upload = multer({ storage: storage });

profileRouter.get('/get',getProfile);
profileRouter.post(
    '/create',
    upload.fields([
        { name: "photo", maxCount: 1 }, 
        { name: "aadhar", maxCount: 1 }
    ]),createOrUpdateProfile);


export default profileRouter;