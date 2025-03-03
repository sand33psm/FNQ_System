import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FeedbackForm from './components/Feedback';
import QueryForum from './components/QueryForum';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Check if user is already logged in
    const loggedInUser = sessionStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);
  
  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };
  
  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/feedback" element={user ? <FeedbackForm user={user} /> : <Navigate to="/login" />} />
          <Route path="/forum" element={user ? <QueryForum user={user} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;