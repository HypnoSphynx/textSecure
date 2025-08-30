import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ user, onLogout }) => {
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setUserData(response.data.data.user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 w-full">
        <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
                             <h1 className="ml-2 sm:ml-3 text-lg sm:text-2xl font-bold text-white">TextChat</h1>
            </div>
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 w-full">
        <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            <a
              href="/dashboard"
              className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Dashboard
            </a>
            <a
              href="/users"
              className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Users
            </a>
            <a
              href="/search-history"
              className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Search History
            </a>
            <a
              href="/messages"
              className="text-white hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative"
            >
              Messages
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full max-w-none mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Welcome Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 overflow-hidden shadow-xl rounded-2xl">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3 sm:ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-300 truncate">
                          Welcome to TextChat
                        </dt>
                        <dd className="text-lg sm:text-2xl font-bold text-white">
                          Start Messaging!
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl overflow-hidden sm:rounded-2xl">
                <div className="px-4 sm:px-6 py-4 sm:py-6 lg:px-8">
                  <h3 className="text-lg sm:text-xl leading-6 font-bold text-white">
                    Account Information
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-300">
                    Personal details and account information
                  </p>
                </div>
                <div className="border-t border-white/20">
                  <dl>
                    <div className="bg-white/5 px-4 sm:px-6 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 lg:px-8">
                      <dt className="text-sm font-medium text-gray-300">
                        Username
                      </dt>
                      <dd className="mt-1 text-sm text-white font-semibold sm:mt-0 sm:col-span-2">
                        {userData?.username}
                      </dd>
                    </div>
                    <div className="bg-white/10 px-4 sm:px-6 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 lg:px-8">
                      <dt className="text-sm font-medium text-gray-300">
                        Email address
                      </dt>
                      <dd className="mt-1 text-sm text-white font-semibold sm:mt-0 sm:col-span-2 break-all">
                        {userData?.email}
                      </dd>
                    </div>
                    <div className="bg-white/5 px-4 sm:px-6 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 lg:px-8">
                      <dt className="text-sm font-medium text-gray-300">
                        Birth date
                      </dt>
                      <dd className="mt-1 text-sm text-white font-semibold sm:mt-0 sm:col-span-2">
                        {userData?.birthdate ? formatDate(userData.birthdate) : 'N/A'}
                      </dd>
                    </div>
                    <div className="bg-white/10 px-4 sm:px-6 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 lg:px-8">
                      <dt className="text-sm font-medium text-gray-300">
                        Mobile number
                      </dt>
                      <dd className="mt-1 text-sm text-white font-semibold sm:mt-0 sm:col-span-2">
                        {userData?.mobileNumber}
                      </dd>
                    </div>
                    <div className="bg-white/5 px-4 sm:px-6 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 lg:px-8">
                      <dt className="text-sm font-medium text-gray-300">
                        District
                      </dt>
                      <dd className="mt-1 text-sm text-white font-semibold sm:mt-0 sm:col-span-2">
                        {userData?.district}
                      </dd>
                    </div>
                    <div className="bg-white/10 px-4 sm:px-6 py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 lg:px-8">
                      <dt className="text-sm font-medium text-gray-300">
                        Account created
                      </dt>
                      <dd className="mt-1 text-sm text-white font-semibold sm:mt-0 sm:col-span-2">
                        {userData?.createdAt ? formatDate(userData.createdAt) : 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/20 rounded-2xl p-4 sm:p-6 backdrop-blur-lg">
            <div className="flex flex-col sm:flex-row sm:items-start">
              <div className="flex-shrink-0 mb-3 sm:mb-0">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="sm:ml-4">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Security Information
                </h3>
                <div className="mt-2 text-sm text-gray-300">
                  <p>
                    Your sensitive information (email, mobile number, and district) is encrypted using AES-256 encryption 
                    and stored securely in our database. This data is automatically decrypted when you view your profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
