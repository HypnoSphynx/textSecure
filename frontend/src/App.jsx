import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserSearchBar from './pages/users';
import SearchHistory from './pages/SearchHistory';
import Messages from './pages/Messages';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading SecureBank...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Home isAuthenticated={isAuthenticated} />} 
        />
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            !isAuthenticated ? (
              <Register onLogin={handleLogin} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route 
          path="/users" 
          element={
            isAuthenticated ? (
              <UserSearchBar />
            ) : (
              <Navigate to="/login" replace />
            )
          }  
        />
        <Route 
          path="/search-history" 
          element={
            isAuthenticated ? (
              <SearchHistory />
            ) : (
              <Navigate to="/login" replace />
            )
          }  
        />
        <Route 
          path="/messages" 
          element={
            isAuthenticated ? (
              <Messages />
            ) : (
              <Navigate to="/login" replace />
            )
          }  
        />

      </Routes>
    </Router>
  );
}

export default App;
