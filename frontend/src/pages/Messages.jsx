import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, User, ArrowLeft, Search, MoreVertical } from 'lucide-react';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  // Refresh conversations when the page becomes visible (e.g., after sending a message from search)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchConversations();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh when the page gains focus
    const handleFocus = () => {
      fetchConversations();
    };
    
    window.addEventListener('focus', handleFocus);

    // Set up periodic refresh every 30 seconds to catch new messages
    const intervalId = setInterval(() => {
      fetchConversations();
    }, 30000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3000/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        const previousCount = conversations.length;
        setConversations(data.data || []);
        
        // Show notification if new conversations were added
        if (data.data && data.data.length > previousCount) {
          setNotification({
            type: 'success',
            message: `New conversation${data.data.length - previousCount > 1 ? 's' : ''} found!`
          });
          setTimeout(() => setNotification(null), 3000);
        }
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch conversations: ${response.status} ${errorText}`);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/messages/conversation/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      } else {
        throw new Error('Failed to fetch messages');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientId: selectedConversation._id,
          content: newMessage.trim()
        })
      });

      if (response.ok) {
        setNewMessage('');
        // Refresh messages
        fetchMessages(selectedConversation._id);
        // Refresh conversations to update last message
        fetchConversations();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { 
        weekday: 'short' 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv._id?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );



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

      <div className="max-w-6xl mx-auto mx-4">
        {/* Notification */}
        {notification && (
          <div className={`mb-4 p-4 rounded-lg border ${
            notification.type === 'success' 
              ? 'bg-green-500/20 border-green-500/30 text-green-300' 
              : 'bg-red-500/20 border-red-500/30 text-red-300'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
            <h3 className="font-semibold mb-2">Error Loading Conversations</h3>
            <p>{error}</p>
            <button
              onClick={fetchConversations}
              className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[80vh]">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Conversations</h2>
                <button
                  onClick={fetchConversations}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white"
                  title="Refresh conversations"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="overflow-y-auto h-[calc(80vh-140px)]">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">No conversations yet</p>
                  <p className="text-gray-400 text-sm">Start messaging users from the Users page</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv._id?._id || conv._id}
                    onClick={() => setSelectedConversation(conv._id)}
                    className={`p-4 cursor-pointer hover:bg-white/10 transition-colors duration-200 border-b border-white/10 ${
                      selectedConversation?._id === conv._id?._id ? 'bg-white/20' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                                                 <h3 className="text-white font-medium truncate">
                           {conv._id?.username || 'Unknown User'}
                         </h3>
                         {conv.lastMessage && (
                           <p className="text-gray-300 text-sm truncate">
                             {conv.lastMessage.sender?.username === conv._id?.username ? 'You: ' : ''}
                             {conv.lastMessage.content}
                           </p>
                         )}

                      </div>
                      <div className="text-right">
                        {conv.lastMessage && (
                          <p className="text-gray-400 text-xs">
                            {formatDate(conv.lastMessage.createdAt)}
                          </p>
                        )}
                        {conv.unreadCount > 0 && (
                          <span className="inline-block bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{selectedConversation.username}</h3>
                        <p className="text-gray-300 text-sm">Active now</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200">
                      <MoreVertical className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="overflow-y-auto h-[calc(80vh-200px)] p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300">No messages yet</p>
                      <p className="text-gray-400 text-sm">Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.sender?._id === selectedConversation._id ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender?._id === selectedConversation._id
                              ? 'bg-white/20 text-white'
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatDate(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-white/20">
                  <div className="flex space-x-3">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      rows={2}
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center space-x-2"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
                  <p className="text-gray-300">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
