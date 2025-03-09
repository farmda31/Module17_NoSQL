import express, { Request, Response, Router, RequestHandler } from "express";
import User from "../models/User"; // Import the User model
import { Types } from "mongoose";
import mongoose from "mongoose";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import jwt from "jsonwebtoken"; // Import jsonwebtoken for token generation

const router: Router = express.Router();
const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Handler to get a user by ID
const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("thoughts")
      .populate("friends");

    if (!user) {
      res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

// Handler to update a user
const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Update user information
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// // Handler to delete a user
// const deleteUser = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const { userId } = req.params;
//     const deletedUser = await User.findByIdAndDelete(userId);

//     if (!deletedUser) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     return res.status(200).json({ message: "User deleted successfully." });
//   } catch (error) {
//     return res.status(500).json({ message: "Error deleting user", error });
//   }
// };

router.post("/api/users", createUser); // Create a new user
router.get("/api/users/:userId", getUserById); // Get a user by ID
router.put("/api/users/:userId", updateUser as RequestHandler); // Update a user

export default router;
