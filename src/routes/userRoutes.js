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
const bcrypt_1 = __importDefault(require("bcrypt")); // Import bcrypt for password hashing
const router = express_1.default.Router();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        // Check if the user already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists." });
            return;
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create a new user
        const newUser = new User_1.default({
            username,
            email,
            password: hashedPassword,
        });
        yield newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});
// Handler to get a user by ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield User_1.default.findById(userId)
            .populate("thoughts")
            .populate("friends");
        if (!user) {
            res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving user", error });
    }
});
// Handler to update a user
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const updates = req.body;
        // Update user information
        const updatedUser = yield User_1.default.findByIdAndUpdate(userId, updates, {
            new: true,
        });
        if (!updatedUser) {
            res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
});
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
router.put("/api/users/:userId", updateUser); // Update a user
exports.default = router;
