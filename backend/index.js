import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import UserModel from "./models/users.js";
import fs from "fs";

// Initialize the express app
const app = express();

// Enable CORS and parse JSON
app.use(cors());
app.use(express.json());

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create 'uploads' folder if it doesn't exist
    }
    cb(null, uploadDir); // Folder to store the files
  },
  filename: (req, file, cb) => {
    // Use timestamp and original file extension to avoid filename collisions
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/Users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// POST route for creating a user and uploading a file
app.post("/upload", upload.single("file"), (req, res) => {
  const { name, email, password } = req.body;

  // Check if the file was uploaded successfully
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Create a new user with file info
  const user = new UserModel({
    name,
    email,
    password,
    file: req.file.path, // Save the file path in the database
  });

  // Save the user data and file path to the database
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

// Start the server
app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
