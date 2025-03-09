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
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
// Handler function for creating a reaction
const createReaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const thought = yield Thought_1.default.findById(req.params.thoughtId);
        if (!thought) {
            return res.status(404).json({ message: "Thought not found" });
        }
        // Create the reaction object
        const newReaction = Thought_1.default.schema.path("reactions").cast({
            reactionId: new mongoose_1.default.Types.ObjectId(),
            reactionBody: req.body.reactionBody,
            username: req.body.username,
            createdAt: new Date(), // Set the current timestamp
        });
        // Push the new reaction to the thought's reactions array
        thought.reactions.push(newReaction);
        yield thought.save();
        return res.status(201).json(thought);
    }
    catch (error) {
        return res.status(500).json({ message: "Error adding reaction", error });
    }
});
// POST to create a reaction
router.post("/api/thoughts/:thoughtId/reactions", createReaction);
exports.default = router;
