import express from "express";
// import { register, login, getProfile } from "../controllers/authController.js";
import {login} from "../controllers/login.js";
import {register} from "../controllers/register.js";
import {getProfile} from "../controllers/getProfile.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", authenticateToken, getProfile);

export default router;
