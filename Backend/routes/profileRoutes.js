import express from "express";
import { createOrUpdateProfile, getProfile } from "../controllers/profileController.js";
import { upload } from "../middleware/upload.js";

const profileRouter = express.Router();

profileRouter.get('/get', getProfile);

// Multiple file fields
profileRouter.post(
  "/create",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "aadharFile", maxCount: 1 },
  ]),
  createOrUpdateProfile
);

export default profileRouter;
