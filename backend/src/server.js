import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "../config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import messageRoutes from "./routes/messages.js";
import searchHistoryRoutes from "./routes/searchHistory.js";
import keyRoutes from "./routes/keys.js";

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/search-history", searchHistoryRoutes);
app.use("/api/keys", keyRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "TextChat API is running!" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`TextChat server is running on port ${PORT}`);
});

