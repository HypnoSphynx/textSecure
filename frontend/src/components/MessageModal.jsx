import React, { useState } from 'react';
import { X, Send, User } from 'lucide-react';

const MessageModal = ({ recipient, isOpen, onClose, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || !recipient) return null;

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    try {
      await onSendMessage(recipient._id, message);
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 rounded-2xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Send Message</h2>
              <p className="text-sm text-gray-300">to {recipient.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Message Input */}
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300 resize-none"
              rows={4}
              disabled={isSending}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-white/20 flex space-x-4">
          <button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2"
          >
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Send Message</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isSending}
            className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
