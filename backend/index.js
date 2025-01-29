import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import UserModel from "./models/users.js";
import fs from "fs";

const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

mongoose
  .connect("mongodb://localhost:27017/Users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.post("/upload", upload.single("file"), (req, res) => {
  const { name, email, password } = req.body;

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const user = new UserModel({
    name,
    email,
    password,
    file: req.file.path,
  });

  user
    .save()
    .then((result) => {
      res
        .status(200)
        .json({ message: "User and file uploaded successfully", user: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error saving user data.");
    });
});

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
