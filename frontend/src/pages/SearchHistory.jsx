import React, { useState, useEffect } from 'react';
import { Search, User, Eye, Calendar, TrendingUp, ArrowLeft } from 'lucide-react';

const SearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [mySearches, setMySearches] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('who-searched-for-me');

  useEffect(() => {
    fetchSearchData();
  }, []);

  const fetchSearchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      // Fetch who searched for me
      const whoSearchedResponse = await fetch('http://localhost:3000/api/search-history/who-searched-for-me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Fetch my search history
      const mySearchesResponse = await fetch('http://localhost:3000/api/search-history/my-searches', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Fetch analytics
      const analyticsResponse = await fetch('http://localhost:3000/api/search-history/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (whoSearchedResponse.ok && mySearchesResponse.ok && analyticsResponse.ok) {
        const whoSearchedData = await whoSearchedResponse.json();
        const mySearchesData = await mySearchesResponse.json();
        const analyticsData = await analyticsResponse.json();

        setSearchHistory(whoSearchedData.data || []);
        setMySearches(mySearchesData.data || []);
        setAnalytics(analyticsData.data);
      } else {
        throw new Error('Failed to fetch search data');
      }
    } catch (err) {
      console.error('Error fetching search data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSearchTypeIcon = (searchType) => {
    switch (searchType) {
      case 'username':
        return <User className="h-4 w-4 text-blue-400" />;
      case 'email':
        return <Search className="h-4 w-4 text-green-400" />;
      case 'district':
        return <Search className="h-4 w-4 text-purple-400" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSearchTypeLabel = (searchType) => {
    switch (searchType) {
      case 'username':
        return 'Username';
      case 'email':
        return 'Email';
      case 'district':
        return 'District';
      default:
        return 'General';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl mb-8 max-w-6xl mx-auto mx-4 mt-4">
        <div className="flex space-x-8 py-4 px-6">
          <a
            href="/dashboard"
            className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </a>
        </div>
      </nav>

      <div className="relative z-10 w-full max-w-none mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Search className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">
            Search <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">History</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Track who searched for you and view your search activity
          </p>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="max-w-6xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{analytics.totalSearches}</h3>
                <p className="text-gray-300">Total Searches</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{analytics.totalTimesSearched}</h3>
                <p className="text-gray-300">Times You Were Searched</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{analytics.recentSearches}</h3>
                <p className="text-gray-300">Recent Searches (7 days)</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{analytics.recentSearchesOnMe}</h3>
                <p className="text-gray-300">Recent Searches on You (7 days)</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex space-x-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('who-searched-for-me')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'who-searched-for-me'
                  ? 'bg-white/20 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Who Searched for Me ({searchHistory.length})
            </button>
            <button
              onClick={() => setActiveTab('my-searches')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'my-searches'
                  ? 'bg-white/20 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              My Searches ({mySearches.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'who-searched-for-me' ? (
            <div className="space-y-4">
              {searchHistory.length === 0 ? (
                <div className="text-center py-16 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-8 w-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">No searches yet</h3>
                  <p className="text-gray-300">When other users search for you, it will appear here</p>
                </div>
              ) : (
                searchHistory.map((search) => (
                  <div
                    key={search._id}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {search.searcher?.username || 'Unknown User'}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            Searched for you on {formatDate(search.createdAt)}
                          </p>
                          {search.searchQuery && (
                            <p className="text-gray-400 text-sm">
                              Query: "{search.searchQuery}"
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getSearchTypeIcon(search.searchType)}
                        <span className="text-sm text-gray-300">
                          {getSearchTypeLabel(search.searchType)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {mySearches.length === 0 ? (
                <div className="text-center py-16 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-8 w-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">No searches yet</h3>
                  <p className="text-gray-300">Your search history will appear here</p>
                </div>
              ) : (
                mySearches.map((search) => (
                  <div
                    key={search._id}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {search.searchedUser?.username || 'Unknown User'}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            You searched on {formatDate(search.createdAt)}
                          </p>
                          {search.searchQuery && (
                            <p className="text-gray-400 text-sm">
                              Query: "{search.searchQuery}"
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getSearchTypeIcon(search.searchType)}
                        <span className="text-sm text-gray-300">
                          {getSearchTypeLabel(search.searchType)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchHistory;
