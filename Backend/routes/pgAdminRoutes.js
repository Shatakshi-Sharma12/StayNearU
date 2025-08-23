import express from "express";
import { addPG, getAdminPG, getAllPG } from "../controllers/pgController.js";
import multer from "multer";
const pgAdminRouter=express.Router();
const storage = multer.diskStorage({
    destination:"uploads/pg",
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})
const upload = multer({ storage: storage });

pgAdminRouter.post('/addPg',
    upload.fields([
        { name: "photo", maxCount: 1 },
    ]),addPG);
pgAdminRouter.get('/getAllPG',getAllPG);
pgAdminRouter.get('/getAdminPG/:id',getAdminPG);

export default pgAdminRouter;