"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the User schema
const UserSchema = new mongoose_1.Schema({
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
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum password length
    },
    thoughts: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Thought", // The ref property links the thoughts array to the Thought model
        },
    ],
    friends: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User", // The ref property links the friends array to the User model
        },
    ],
}, { timestamps: true } // Automatically manage createdAt and updatedAt fields
);
// Create the virtual field for friendCount
UserSchema.virtual("friendCount").get(function () {
    return this.friends.length;
});
// Creates the User model
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
