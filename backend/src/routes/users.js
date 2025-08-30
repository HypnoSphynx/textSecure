import express from "express";
import { getUsers, searchUsers } from "../controllers/getUsers.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

// Get all users
router.get("/", getUsers);

// Search users with filters
router.get("/search", searchUsers);

export default router;
