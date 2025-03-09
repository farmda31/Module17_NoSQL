import express, { Router, Request, Response } from "express";
import User from "../models/User"; // Import the User model
import { Types } from "mongoose";
import mongoose from "mongoose";

const router = express.Router();

// Function to add a new friend to a user's friend list
const addFriend = async (
  req: Request<{ userId: string; friendId: string }>,
  res: Response
): Promise<Response> => {
  const { userId, friendId } = req.params;

  // Validate ObjectId
  if (userId === friendId) {
    return res.status(400).json({ message: "Invalid user ID or friend ID" });
  }

  try {
    // Add friendId to user's friends array
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User and Friend not found" });
    }

    // Adding friend to user's friends array
    if (!user.friends.includes(new mongoose.Types.ObjectId(friendId))) {
      user.friends.push(new mongoose.Types.ObjectId(friendId));
      await user.save();
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error adding friend", error });
  }
};

// Function to remove a friend from a user's friend list
const removeFriend = async (
  req: Request<{ userId: string; friendId: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { userId, friendId } = req.params;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.friends = user.friends.filter(
      (friend) => friend.toString() !== friendId
    );
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error removing friend", error });
  }
};

router.post("/api/users/:userId/friends/:friendId", addFriend); // Add a friend
router.delete("/api/users/:userId/friends/:friendId", removeFriend); // Remove a friend

export default router;
