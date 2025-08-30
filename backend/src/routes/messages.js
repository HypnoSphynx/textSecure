import express from "express";
import { 
  sendMessage, 
  getConversation, 
  getConversations, 
  markAsRead,
  testMessages
} from "../controllers/messageController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All message routes require authentication
router.use(authenticateToken);

// Test endpoint
router.get("/test", testMessages);

// Send a message
router.post("/send", sendMessage);

// Get conversation between two users
router.get("/conversation/:userId", getConversation);

// Get all conversations for current user
router.get("/conversations", getConversations);

// Mark message as read
router.patch("/read/:messageId", markAsRead);

export default router;
