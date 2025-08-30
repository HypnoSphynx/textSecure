import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema({
  searcher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  searchedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  searchQuery: {
    type: String,
    trim: true
  },
  searchType: {
    type: String,
    enum: ['username', 'email', 'district', 'general'],
    default: 'general'
  }
}, {
  timestamps: true
});

// Index for efficient querying
searchHistorySchema.index({ searcher: 1, searchedUser: 1, createdAt: -1 });
searchHistorySchema.index({ searchedUser: 1, createdAt: -1 });

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);

export default SearchHistory;
