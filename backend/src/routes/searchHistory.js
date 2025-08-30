import express from "express";
import { 
  recordSearch, 
  getWhoSearchedForMe, 
  getMySearchHistory, 
  getSearchAnalytics 
} from "../controllers/searchHistoryController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All search history routes require authentication
router.use(authenticateToken);

// Record a search
router.post("/record", recordSearch);

// Get who searched for current user
router.get("/who-searched-for-me", getWhoSearchedForMe);

// Get current user's search history
router.get("/my-searches", getMySearchHistory);

// Get search analytics
router.get("/analytics", getSearchAnalytics);

export default router;
