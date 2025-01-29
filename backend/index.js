import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import UserModel from "./models/users.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/Users");

app.post("/", (req, res) => {
  const { name, email, password } = req.body;
  UserModel.create({
    name,
    email,
    password,
  })
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
});

app.listen(3001, () => {
  console.log("Server is running on 3001");
});
