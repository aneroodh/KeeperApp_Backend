import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables before anything else

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Sample route
app.get("/", (req, res) => {
  res.send("KeeperApp API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
