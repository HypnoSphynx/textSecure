import React, { useState, useEffect } from 'react';
import { Search, User, MapPin, Phone, Mail, X, Filter, Calendar, Shield, Eye, MessageCircle } from 'lucide-react';
import UserProfileModal from '../components/UserProfileModal';
import MessageModal from '../components/MessageModal';

const UserSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [filters, setFilters] = useState({
    district: '',
    ageRange: { min: '', max: '' }
  });

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.data || []);
      setSearchResults(data.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
      // Fallback to empty array
      setUsers([]);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Calculate age from birthdate
  const calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Search function using API
  const performSearch = async (query, appliedFilters = filters) => {
    setIsSearching(true);
    
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (query) params.append('query', query);
      if (appliedFilters.district) params.append('district', appliedFilters.district);
      if (appliedFilters.ageRange.min) params.append('minAge', appliedFilters.ageRange.min);
      if (appliedFilters.ageRange.max) params.append('maxAge', appliedFilters.ageRange.max);
      
      const response = await fetch(`http://localhost:3000/api/users/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setSearchResults(data.data || []);
      
      // Record search history for each user found
      if (query && data.data && data.data.length > 0) {
        recordSearchHistory(data.data, query);
      }
    } catch (err) {
      console.error('Search error:', err);
      // Fallback to client-side filtering
      let results = users.filter(user => {
        const matchesQuery = query === '' || 
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.district.toLowerCase().includes(query.toLowerCase()) ||
          user.mobileNumber.includes(query);
        
        const matchesDistrict = !appliedFilters.district || 
          user.district.toLowerCase().includes(appliedFilters.district.toLowerCase());
        
        const userAge = calculateAge(user.birthdate);
        const matchesAgeRange = (!appliedFilters.ageRange.min || userAge >= parseInt(appliedFilters.ageRange.min)) &&
          (!appliedFilters.ageRange.max || userAge <= parseInt(appliedFilters.ageRange.max));
        
        return matchesQuery && matchesDistrict && matchesAgeRange;
      });
      
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  // Record search history
  const recordSearchHistory = async (users, query) => {
    try {
      const token = localStorage.getItem('token');
      const searchType = determineSearchType(query);
      
      // Record search for each user found
      for (const user of users) {
        await fetch('http://localhost:3000/api/search-history/record', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            searchedUserId: user._id,
            searchQuery: query,
            searchType
          })
        });
      }
    } catch (error) {
      console.error('Failed to record search history:', error);
    }
  };

  // Determine search type based on query
  const determineSearchType = (query) => {
    if (query.includes('@')) return 'email';
    if (query.match(/^[0-9+\-\s()]+$/)) return 'mobile';
    if (query.length <= 20) return 'username';
    return 'general';
  };

  // Handle viewing user profile
  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  // Handle sending message
  const handleSendMessage = async (recipientId, content) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId,
          content
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Show success message and redirect to messages page
      console.log('Message sent successfully');
      
      // Close the message modal
      setShowMessageModal(false);
      
      // Show success notification
      alert('Message sent successfully! Redirecting to Messages...');
      
      // Redirect to messages page after a short delay
      setTimeout(() => {
        window.location.href = '/messages';
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Open message modal
  const openMessageModal = (user) => {
    setMessageRecipient(user);
    setShowMessageModal(true);
  };

  // Handle search input change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 0) {
        performSearch(searchQuery);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters };
    if (filterType === 'ageRange') {
      newFilters.ageRange = { ...newFilters.ageRange, ...value };
    } else {
      newFilters[filterType] = value;
    }
    setFilters(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      district: '',
      ageRange: { min: '', max: '' }
    });
  };

  const hasActiveFilters = filters.district || filters.ageRange.min || filters.ageRange.max;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-none mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Navigation */}
        <nav className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl mb-8 max-w-6xl mx-auto">
          <div className="flex space-x-8 py-4 px-6">
            <a
              href="/dashboard"
              className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              ← Back to Dashboard
            </a>
            <a
              href="/messages"
              className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Messages
            </a>
          </div>
        </nav>

        {/* Header */}
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Search className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">
            User <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Search</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Search and manage users with advanced filtering options
          </p>
        </div>

        {/* Search Bar */}
        <div className={`relative mb-6 sm:mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none">
              <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username, email, mobile number, or district..."
              className="w-full pl-12 sm:pl-16 pr-12 sm:pr-16 py-4 sm:py-6 text-base sm:text-lg bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-white placeholder-gray-400 shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 sm:pr-6 flex items-center"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-white transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className={`flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 max-w-6xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 sm:px-6 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 mb-4 sm:mb-0"
          >
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Advanced Filters</span>
            {hasActiveFilters && (
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* District Filter */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-white mb-3">
                  District
                </label>
                <input
                  type="text"
                  value={filters.district}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
                  placeholder="Enter district name"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300"
                />
              </div>

              {/* Age Range Filter */}
              <div>
                <label className="block text-sm sm:text-base font-medium text-white mb-3">
                  Age Range
                </label>
                <div className="flex space-x-3">
                  <input
                    type="number"
                    value={filters.ageRange.min}
                    onChange={(e) => handleFilterChange('ageRange', { min: e.target.value })}
                    placeholder="Min"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300"
                  />
                  <input
                    type="number"
                    value={filters.ageRange.max}
                    onChange={(e) => handleFilterChange('ageRange', { max: e.target.value })}
                    placeholder="Max"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-6xl mx-auto mb-6">
            <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-2xl p-6 text-center">
              <p className="text-red-300 text-lg">Error: {error}</p>
              <button
                onClick={fetchUsers}
                className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-0">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Loading users...</span>
                </div>
              ) : isSearching ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                `${searchResults.length} user${searchResults.length !== 1 ? 's' : ''} found`
              )}
            </h2>
            
            {searchQuery && (
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <span>Results for</span>
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-lg">
                  "{searchQuery}"
                </span>
              </div>
            )}
          </div>

          {/* Results List */}
          {!isSearching && (
            <div className="space-y-4 sm:space-y-6">
              {searchResults.length === 0 ? (
                <div className="text-center py-16 sm:py-20 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="h-8 w-8 sm:h-10 sm:w-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">No users found</h3>
                  <p className="text-gray-300 text-base sm:text-lg">Try adjusting your search terms or filters</p>
                </div>
              ) : (
                searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-8 hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4 sm:mb-6">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-white">
                              {user.username}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-300">
                              Member since {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm sm:text-base mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                              <Mail className="h-4 w-4 text-gray-300" />
                            </div>
                            <span className="text-gray-300">{user.email}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                              <Phone className="h-4 w-4 text-gray-300" />
                            </div>
                            <span className="text-gray-300">{user.mobileNumber}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                              <MapPin className="h-4 w-4 text-gray-300" />
                            </div>
                            <span className="text-gray-300">{user.district}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-300">
                              Age: {calculateAge(user.birthdate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-6">
                        <Shield className="h-5 w-5 text-green-400" />
                        <span className="text-xs sm:text-sm text-green-400">Verified</span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 mt-4 lg:mt-0 lg:ml-6">
                        <button
                          onClick={() => handleViewProfile(user)}
                          className="flex items-center space-x-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="text-sm">View Profile</span>
                        </button>
                        <button
                          onClick={() => openMessageModal(user)}
                          className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all duration-200 transform hover:scale-105"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">Message</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        user={selectedUser}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSendMessage={openMessageModal}
      />

      {/* Message Modal */}
      <MessageModal
        recipient={messageRecipient}
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default UserSearchBar;