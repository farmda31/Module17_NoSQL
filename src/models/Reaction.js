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
exports.ReactionSchema = void 0;
// This will not be a model, but rather will be used as the reaction field's sub-document schema in the Thought model.
const mongoose_1 = __importStar(require("mongoose"));
// Define and export the Reaction schema
const ReactionSchema = new mongoose_1.Schema({
    reactionId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: () => new mongoose_1.default.Types.ObjectId(), // Automatically generate a new ObjectId
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
}, {
    _id: false,
    timestamps: true, // Automatically manages the createdAt and updatedAt values
});
exports.ReactionSchema = ReactionSchema;
// Apply the getter to the createdAt field
ReactionSchema.path("createdAt").get(function (value) {
    return value ? value.toISOString() : null; // Format the timestamp on query
});
ReactionSchema.set("toJSON", {
    getters: true,
});
