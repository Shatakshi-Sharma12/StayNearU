import multer from "multer";
import path from "path";
import fs from "fs";

// Create folder if not exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

ensureDir("uploads/profile");
ensureDir("uploads/aadhar");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "profilePhoto") {
      cb(null, "uploads/profile");
    } else if (file.fieldname === "aadharFile") {
      cb(null, "uploads/aadhar");
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

export const upload = multer({ storage });
