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
const Thought_1 = __importDefault(require("../models/Thought")); // Import the Thought model
const User_1 = __importDefault(require("../models/User")); // Import the User model
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
// GET all thoughts
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thoughts = yield Thought_1.default.find().populate("reactions");
        res.status(200).json(thoughts);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving thoughts", error });
    }
}));
// GET a single thought by _id
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const thoughtId = req.params.id;
    // Validate the ObjectId
    if (!mongoose_1.default.Types.ObjectId.isValid(thoughtId)) {
        return res.status(400).json({ message: "Invalid thought ID" });
    }
    try {
        const thought = yield Thought_1.default.findById(thoughtId);
        if (!thought) {
            return res.status(404).json({ message: "Thought not found" });
        }
        return res.status(200).json(thought);
    }
    catch (error) {
        return res.status(500).json({ message: "Error retrieving thought", error });
    }
}));
// POST to create a new thought and push its _id to the associated user's thoughts array
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { thoughtText, username, userId } = req.body;
    try {
        const newThought = new Thought_1.default({ thoughtText, username });
        yield newThought.save();
        // Push the created thought's _id to the associated user's thoughts array
        yield User_1.default.findByIdAndUpdate(userId, {
            $push: { thoughts: newThought._id },
        });
        res.status(201).json(newThought);
    }
    catch (error) {
        res.status(400).json({ message: "Error creating thought", error });
    }
}));
// PUT to update a thought by _id
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const thoughtId = req.params.id;
    // Validate the ObjectId
    if (!mongoose_1.default.Types.ObjectId.isValid(thoughtId)) {
        return res.status(400).json({ message: "Invalid thought ID" });
    }
    try {
        const updatedThought = yield Thought_1.default.findByIdAndUpdate(thoughtId, req.body, { new: true });
        if (!updatedThought) {
            return res.status(404).json({ message: "Thought not found" });
        }
        return res.status(200).json(updatedThought);
    }
    catch (error) {
        return res.status(500).json({ message: "Error updating thought", error });
    }
}));
// DELETE to remove a thought by _id
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const thoughtId = req.params.id;
    // Validate the ObjectId
    if (!mongoose_1.default.Types.ObjectId.isValid(thoughtId)) {
        return res.status(400).json({ message: "Invalid thought ID" });
    }
    try {
        const deletedThought = yield Thought_1.default.findByIdAndDelete(thoughtId);
        if (!deletedThought) {
            return res.status(404).json({ message: "Thought not found" });
        }
        return res.status(200).json({ message: "Thought deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error deleting thought", error });
    }
}));
exports.default = router;
