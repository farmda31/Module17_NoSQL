// This will not be a model, but rather will be used as the reaction field's sub-document schema in the Thought model.
import mongoose, { Schema, Document } from "mongoose";

// Define and the interface for the Reaction model

export interface IReaction extends Document {
  reactionId: mongoose.Types.ObjectId;
  reactionBody: string;
  username: string;
  createdAt: Date;
}

// Define and export the Reaction schema
const ReactionSchema: Schema<IReaction> = new Schema(
  {
    reactionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(), // Automatically generate a new ObjectId
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280, // Limit the length of the reaction body
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Sets the default value to current timestamp
    },
  },
  {
    _id: false, // Do not create an _id field for this schema
    timestamps: true, // Automatically manages the createdAt and updatedAt values
  }
);

// Apply the getter to the createdAt field
ReactionSchema.path("createdAt").get(function (value: Date) {
  return value ? value.toISOString() : null; // Format the timestamp on query
});

ReactionSchema.set("toJSON", {
  getters: true,
});

// Create the Reaction model
// const Reaction = mongoose.model<IReaction>("Reaction", ReactionSchema);

export { ReactionSchema };
