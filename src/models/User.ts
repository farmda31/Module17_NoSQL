import mongoose, { Schema, model, Document } from "mongoose";

// Define the interface for the User model
interface IUser extends Document {
  username: string;
  email: string;
  // password: string;
  // thoughts: mongoose.Types.ObjectId[];
  friends: mongoose.Types.ObjectId[];
  // friendCount: number; // This is a virtual field
}

// Define the User schema
const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "You need to provide a username!"],
      trim: true,
      minlength: 1,
      maxlength: 30,
    },
    email: {
      type: String,
      required: [true, "You need to provide an email!"],
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid e-mail address"], //Validates th email address
    },
    // password: {
    //   type: String,
    //   required: true,
    //   minlength: 6, // Minimum password length
    // },
    // thoughts: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Thought", // The ref property links the thoughts array to the Thought model
    //   },
    // ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // The ref property links the friends array to the User model
      },
    ],
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Create the virtual field for friendCount
UserSchema.virtual("friendCount").get(function (this: IUser) {
  return this.friends.length;
});

// Creates the User model
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
export { IUser }; // Export the IUser interface
