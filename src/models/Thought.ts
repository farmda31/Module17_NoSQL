import mongoose, { Schema, model, Document } from "mongoose";
import { IReaction, ReactionSchema } from "./Reaction"; // Import the IReaction

// Define the interface for the Thought model
interface IThought extends Document {
  thoughtText: string;
  createdAt: Date;
  username: string;
  reactions: IReaction[];
  reactionCount: number; // This is a virtual field
}

// Define the Thought schema
const ThoughtSchema: Schema<IThought> = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280, // Limit the length of the thought text
    },
    createdAt: {
      type: Date,
      default: Date.now, // Set default value to current timestamp
      get: (timestamp: Date) => timestamp.toISOString(), // Format the timestamp on query
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [ReactionSchema], // Use the ReactionSchema to validate data
  },
  { timestamps: true }
);

// Apply the getter to the createdAt field
ThoughtSchema.path("createdAt").get(function (this: IThought) {
  return this.get("createdAt") ? this.get("createdAt").toISOString() : null;
});

// Create a virtual field for reactionCount
ThoughtSchema.virtual("reactionCount").get(function (this: IThought) {
  return this.reactions.length;
});

ThoughtSchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

// Create the Thought model
const Thought = mongoose.model<IThought>("Thought", ThoughtSchema);

export default Thought;
export { IThought }; // Export the IThought interface
