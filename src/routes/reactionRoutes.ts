import express, { Router, Request, Response } from "express";
import Thought from "../models/Thought"; // Import the Thought model
import mongoose from "mongoose";
import { IReaction } from "../models/Reaction"; // Import the IReaction

const router: Router = express.Router();

interface ReactionRequestBody {
  reactionBody: string;
  username: string;
}

// Handler function for creating a reaction
const createReaction = async (
  req: Request<{ thoughtId: string }, {}, ReactionRequestBody>,
  res: Response
): Promise<Response> => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    // Create the reaction object
    const newReaction: IReaction = Thought.schema.path("reactions").cast({
      reactionId: new mongoose.Types.ObjectId(), // Generates a new objectId
      reactionBody: req.body.reactionBody, // Get the reaction body from the request body
      username: req.body.username, // Get the username from the request body
      createdAt: new Date(), // Set the current timestamp
    });

    // Push the new reaction to the thought's reactions array
    thought.reactions.push(newReaction);
    await thought.save();
    return res.status(201).json(thought);
  } catch (error) {
    return res.status(500).json({ message: "Error adding reaction", error });
  }
};

// POST to create a reaction
router.post("/api/thoughts/:thoughtId/reactions", createReaction);

export default router;
