import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./src/routes/userRoutes"; // Adjust the path as necessary
import thoughtRoutes from "./src/routes/thoughtRoutes"; // Adjust the path as necessary
import reactionRoutes from "./src/routes/reactionRoutes"; // Adjust the path as necessary
import friendRoutes from "./src/routes/friendRoutes"; // Adjust the path as necessary

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Middle to Parse JSON bodies

// Routes
app.use("/api", userRoutes);
app.use("/api", thoughtRoutes);
app.use("/api", reactionRoutes); // Reaction routes are under thoughts
app.use("/api", friendRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
