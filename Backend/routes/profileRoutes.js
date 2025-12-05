import express from "express";
import { createOrUpdateProfile, getProfile } from "../controllers/profileController.js";

const profileRouter = express.Router();

profileRouter.get('/get', getProfile);
profileRouter.post('/create', createOrUpdateProfile);

export default profileRouter;
