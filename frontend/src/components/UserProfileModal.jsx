import React from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, Shield, MessageCircle } from 'lucide-react';

const UserProfileModal = ({ user, isOpen, onClose, onSendMessage }) => {
  if (!isOpen || !user) return null;

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white">User Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{user.username}</h3>
              <p className="text-gray-300">Member since {formatDate(user.createdAt)}</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Mail className="h-4 w-4 text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-300">Email</span>
              </div>
              <p className="text-white text-sm break-all">{user.email}</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Phone className="h-4 w-4 text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-300">Mobile</span>
              </div>
              <p className="text-white text-sm">{user.mobileNumber}</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-300">District</span>
              </div>
              <p className="text-white text-sm">{user.district}</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-300">Age</span>
              </div>
              <p className="text-white text-sm">{calculateAge(user.birthdate)} years old</p>
            </div>
          </div>

          {/* Birth Date */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-gray-300" />
              </div>
              <span className="text-sm font-medium text-gray-300">Birth Date</span>
            </div>
            <p className="text-white text-sm">{formatDate(user.birthdate)}</p>
          </div>

          {/* Verification Status */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium text-green-400">Verified Account</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-white/20 flex space-x-4">
          <button
            onClick={() => onSendMessage(user)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Send Message</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
