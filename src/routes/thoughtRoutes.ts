import express, { Request, Response } from "express";
import Thought from "../models/Thought"; // Import the Thought model
import User from "../models/User"; // Import the User model
import mongoose from "mongoose";

const router = express.Router();

// GET all thoughts
router.get("/", async (req: Request, res: Response) => {
  try {
    const thoughts = await Thought.find().populate("reactions");
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving thoughts", error });
  }
});

// GET a single thought by _id
router.get("/:id", async (req: Request, res: Response) => {
  const thoughtId = req.params.id;

  // Validate the ObjectId
  if (!mongoose.Types.ObjectId.isValid(thoughtId)) {
    return res.status(400).json({ message: "Invalid thought ID" });
  }

  try {
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    return res.status(200).json(thought);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving thought", error });
  }
});

// POST to create a new thought and push its _id to the associated user's thoughts array
router.post("/", async (req, res) => {
  const { thoughtText, username, userId } = req.body;

  try {
    const newThought = new Thought({ thoughtText, username });
    await newThought.save();

    // Push the created thought's _id to the associated user's thoughts array
    await User.findByIdAndUpdate(userId, {
      $push: { thoughts: newThought._id },
    });

    res.status(201).json(newThought);
  } catch (error) {
    res.status(400).json({ message: "Error creating thought", error });
  }
});

// PUT to update a thought by _id
router.put("/:id", async (req: Request, res: Response) => {
  const thoughtId = req.params.id;

  // Validate the ObjectId
  if (!mongoose.Types.ObjectId.isValid(thoughtId)) {
    return res.status(400).json({ message: "Invalid thought ID" });
  }

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      req.body,
      { new: true }
    );
    if (!updatedThought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    return res.status(200).json(updatedThought);
  } catch (error) {
    return res.status(500).json({ message: "Error updating thought", error });
  }
});

// DELETE to remove a thought by _id
router.delete(
  "/:id",
  async (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
    const thoughtId = req.params.id;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(thoughtId)) {
      return res.status(400).json({ message: "Invalid thought ID" });
    }

    try {
      const deletedThought = await Thought.findByIdAndDelete(thoughtId);
      if (!deletedThought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      return res.status(200).json({ message: "Thought deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting thought", error });
    }
  }
);

export default router;
