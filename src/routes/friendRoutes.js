"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User")); // Import the User model
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
// Function to add a new friend to a user's friend list
const addFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, friendId } = req.params;
    // Validate ObjectId
    if (userId === friendId) {
        return res.status(400).json({ message: "Invalid user ID or friend ID" });
    }
    try {
        // Add friendId to user's friends array
        const user = yield User_1.default.findById(userId);
        const friend = yield User_1.default.findById(friendId);
        if (!user || !friend) {
            return res.status(404).json({ message: "User and Friend not found" });
        }
        // Adding friend to user's friends array
        if (!user.friends.includes(new mongoose_1.default.Types.ObjectId(friendId))) {
            user.friends.push(new mongoose_1.default.Types.ObjectId(friendId));
            yield user.save();
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: "Error adding friend", error });
    }
});
// Function to remove a friend from a user's friend list
const removeFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, friendId } = req.params;
        // Find user
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.friends = user.friends.filter((friend) => friend.toString() !== friendId);
        yield user.save();
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: "Error removing friend", error });
    }
});
router.post("/api/users/:userId/friends/:friendId", addFriend); // Add a friend
router.delete("/api/users/:userId/friends/:friendId", removeFriend); // Remove a friend
exports.default = router;
