import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = ({ isAuthenticated }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      title: "Secure Messaging",
      description: "Your conversations are protected with military-grade AES encryption",
      icon: "🔒",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Easy Registration",
      description: "Quick and simple account creation to start messaging",
      icon: "⚡",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Real-time Chat",
      description: "Send and receive messages instantly with real-time updates",
      icon: "💬",
      color: "from-purple-500 to-purple-600"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-10 px-4 sm:px-6 py-4 w-full">
        <div className="w-full max-w-none mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg sm:text-xl font-bold">T</span>
            </div>
            <span className="text-white text-xl sm:text-2xl font-bold">TextChat</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 sm:px-6 py-2 text-white hover:text-blue-300 transition-colors duration-300 text-sm sm:text-base"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-800/95 backdrop-blur-lg border-t border-white/20">
            <div className="px-4 py-4 space-y-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-white hover:text-blue-300 transition-colors duration-300 text-center border border-white/20 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="block px-4 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden w-full">
        <div className="w-full max-w-none mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center">
            <h1 className={`text-4xl sm:text-6xl md:text-8xl font-bold text-white mb-4 sm:mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Welcome to
              <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                SecureBank
              </span>
            </h1>
            <p className={`text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Experience messaging like never before with our advanced security features
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center px-4 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-base sm:text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Create Account
                  </Link>
                  <Link
                    to="/login"
                    className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white rounded-lg text-base sm:text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg text-base sm:text-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(30)].map((_, i) => (
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
      </div>

      {/* Features Section */}
      <div className="relative py-12 sm:py-20 w-full">
        <div className="w-full max-w-none mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 px-4">
              Why Choose TextChat?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Experience banking like never before with our advanced security features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`relative p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 transition-all duration-500 transform hover:scale-105 ${
                  currentFeature === index ? 'bg-white/20 border-white/40' : ''
                }`}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-6 mx-auto`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-center leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="relative py-12 sm:py-20 w-full">
        <div className="w-full max-w-none mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-6 sm:p-12 backdrop-blur-lg border border-white/20">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-2xl sm:text-3xl mb-6 sm:mb-8 mx-auto">
                🔐
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 px-4">
                Chat-Grade Security
              </h3>
              <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                Your conversations and personal data are encrypted using AES-256 encryption, ensuring your information remains secure and private at all times.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white mb-2">AES-256</div>
                  <div className="text-gray-300 text-sm sm:text-base">Military-grade encryption</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white mb-2">24/7</div>
                  <div className="text-gray-300 text-sm sm:text-base">Continuous monitoring</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white mb-2">100%</div>
                  <div className="text-gray-300 text-sm sm:text-base">Data protection</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative py-8 sm:py-12 border-t border-white/20 w-full">
        <div className="w-full max-w-none mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm font-bold">T</span>
            </div>
            <span className="text-white text-lg sm:text-xl font-bold">TextChat</span>
          </div>
          <p className="text-gray-400 text-sm sm:text-base px-4">
            © 2024 TextChat. All rights reserved. Messaging with confidence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
