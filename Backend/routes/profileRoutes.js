import express from "express";
import { createOrUpdateProfile, getProfile } from "../controllers/profileController.js";
import multer from "multer";
const profileRouter=express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (file.fieldname === "photo") cb(null, "uploads/profile");
        else if (file.fieldname === "aadhar") cb(null, "uploads/aadhar");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

profileRouter.get('/get',getProfile);
profileRouter.post(
    '/create',
    upload.fields([
        { name: "photo", maxCount: 1 }, 
        { name: "aadhar", maxCount: 1 }
    ]),createOrUpdateProfile);


export default profileRouter;