import express from "express";
import { getPG, getSearchRes } from "../controllers/pgController.js";
import { postReview } from "../controllers/reviewController.js";
import multer from "multer";
const pgUserRouter=express.Router();

const storage = multer.diskStorage({
    destination:"uploads/pg",
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})
const upload = multer({ storage: storage });


pgUserRouter.get('/search',getSearchRes);
pgUserRouter.get('/getPG/:id',getPG);
pgUserRouter.post('/getPG/:id/review',postReview);

export default pgUserRouter;