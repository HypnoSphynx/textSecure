import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthdate: '',
    mobileNumber: '',
    district: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await axios.post('http://localhost:3000/api/auth/register', registrationData);
      
      if (response.data.success) {
        onLogin(response.data.data.user, response.data.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Back to Home Link */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
        <Link
          to="/"
          className="flex items-center text-white hover:text-blue-300 transition-colors duration-300 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>
      
      <div className="max-w-sm sm:max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-blue-600">
            <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base text-gray-300">
            Join SecureBank today
          </p>
        </div>
        
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-sm sm:text-base">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 sm:py-3 border border-gray-600 bg-gray-800/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-sm sm:text-base backdrop-blur-sm"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 sm:py-3 border border-gray-600 bg-gray-800/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-sm sm:text-base backdrop-blur-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="birthdate" className="block text-sm font-medium text-white">
                Birth Date
              </label>
              <input
                id="birthdate"
                name="birthdate"
                type="date"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 sm:py-3 border border-gray-600 bg-gray-800/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-sm sm:text-base backdrop-blur-sm"
                value={formData.birthdate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-white">
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 sm:py-3 border border-gray-600 bg-gray-800/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-sm sm:text-base backdrop-blur-sm"
                placeholder="Enter your mobile number"
                value={formData.mobileNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="district" className="block text-sm font-medium text-white">
                District
              </label>
              <input
                id="district"
                name="district"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 sm:py-3 border border-gray-600 bg-gray-800/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-sm sm:text-base backdrop-blur-sm"
                placeholder="Enter your district"
                value={formData.district}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 sm:py-3 border border-gray-600 bg-gray-800/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-sm sm:text-base backdrop-blur-sm"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-3 sm:py-3 border border-gray-600 bg-gray-800/50 placeholder-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 text-sm sm:text-base backdrop-blur-sm"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
