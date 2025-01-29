import mongoose from "mongoose";

// Define the schema for the User
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  file: String,
});

// Create the User model with the schema
const UserModel = mongoose.model("User", UserSchema, "Users");

export default UserModel;
