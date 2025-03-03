import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FeedbackForm from './components/Feedback';
import QueryForum from './components/QueryForum';
import Navbar from './components/Navbar';

// Setup axios defaults
axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com'; // Using JSONPlaceholder as mock API

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Check if user is already logged in
    const loggedInUser = sessionStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
      toast.success('Welcome back!');
    }
  }, []);
  
  const handleLogin = async (userData) => {
    try {
      setLoading(true);
      // Simulate API login verification
      const response = await axios.get(`/users/${userData.id}`);
      
      if (response.status === 200) {
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
        toast.success(`Welcome, ${userData.name}!`);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    toast.info('You have been logged out');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} loading={loading} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/feedback" element={user ? <FeedbackForm user={user} /> : <Navigate to="/login" />} />
          <Route path="/forum" element={user ? <QueryForum user={user} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
        
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </div>
    </Router>
  );
}

export default App;