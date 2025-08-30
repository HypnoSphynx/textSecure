import SearchHistory from "../models/SearchHistory.js";
import User from "../models/User.js";

// Record a search
export const recordSearch = async (req, res) => {
  try {
    const { searchedUserId, searchQuery, searchType } = req.body;
    const searcherId = req.userId;

    // Validate input
    if (!searchedUserId) {
      return res.status(400).json({
        success: false,
        message: "Searched user ID is required"
      });
    }

    // Check if searched user exists
    const searchedUser = await User.findById(searchedUserId);
    if (!searchedUser) {
      return res.status(404).json({
        success: false,
        message: "Searched user not found"
      });
    }

    // Prevent recording search for self
    if (searcherId === searchedUserId) {
      return res.status(400).json({
        success: false,
        message: "Cannot record search for yourself"
      });
    }

    // Create search history record
    const searchRecord = new SearchHistory({
      searcher: searcherId,
      searchedUser: searchedUserId,
      searchQuery: searchQuery || '',
      searchType: searchType || 'general'
    });

    await searchRecord.save();

    res.status(201).json({
      success: true,
      message: "Search recorded successfully",
      data: searchRecord
    });

  } catch (error) {
    console.error("Error recording search:", error);
    res.status(500).json({
      success: false,
      message: "Failed to record search",
      error: error.message
    });
  }
};

// Get who searched for current user
export const getWhoSearchedForMe = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    // Get search history where current user was searched
    const searches = await SearchHistory.find({ searchedUser: currentUserId })
      .populate('searcher', 'username email district')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await SearchHistory.countDocuments({ searchedUser: currentUserId });

    res.status(200).json({
      success: true,
      data: searches,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error("Error getting search history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get search history",
      error: error.message
    });
  }
};

// Get current user's search history
export const getMySearchHistory = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    // Get search history where current user was the searcher
    const searches = await SearchHistory.find({ searcher: currentUserId })
      .populate('searchedUser', 'username email district')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await SearchHistory.countDocuments({ searcher: currentUserId });

    res.status(200).json({
      success: true,
      data: searches,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error("Error getting search history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get search history",
      error: error.message
    });
  }
};

// Get search analytics for current user
export const getSearchAnalytics = async (req, res) => {
  try {
    const currentUserId = req.userId;

    // Get total searches by current user
    const totalSearches = await SearchHistory.countDocuments({ searcher: currentUserId });

    // Get total times current user was searched
    const totalTimesSearched = await SearchHistory.countDocuments({ searchedUser: currentUserId });

    // Get recent searches (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSearches = await SearchHistory.countDocuments({
      searcher: currentUserId,
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get recent searches on current user (last 7 days)
    const recentSearchesOnMe = await SearchHistory.countDocuments({
      searchedUser: currentUserId,
      createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        totalSearches,
        totalTimesSearched,
        recentSearches,
        recentSearchesOnMe
      }
    });

  } catch (error) {
    console.error("Error getting search analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get search analytics",
      error: error.message
    });
  }
};
