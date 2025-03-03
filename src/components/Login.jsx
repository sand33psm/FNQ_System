import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import "../App.css";

const Login = ({ onLogin, loading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from an API
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/user');
        console.log("res=> ",response);
        
        // Map the API response to our user structure
        const mappedUsers = response.data.slice(0, 3).map(user => ({
          id: user.id,
          username: user.username.toLowerCase(),
          password: 'test', // In a real app, never store passwords in front-end code
          role: 'trainee',
          name: user.name
        }));
        
        localStorage.setItem('users', JSON.stringify(mappedUsers));
        setUsers(mappedUsers);
        
        // Add some logging to help you see the mapped users for login
        console.log('Available users for testing:', 
          mappedUsers.map(u => ({ username: u.username, password: 'test' }))
        );
      } catch (error) {
        console.error('Error fetching users:', error);
        // toast.error('Failed to load user data');
        
        // Fallback to dummy users if API fails
        const dummyUsers = [
          { id: 1, username: 'adi', password: 'test', role: 'trainee', name: 'Adinath Panchal' },
          { id: 2, username: 'sai', password: 'test', role: 'trainee', name: 'Sai Upase' },
          { id: 3, username: 'shweta', password: 'test', role: 'trainee', name: 'Shweta Jadhav' }
        ];
        localStorage.setItem('users', JSON.stringify(dummyUsers));
        setUsers(dummyUsers);
      }
    };
    
    fetchUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      // Don't store password in sessionStorage for security reasons
      const { password, ...userWithoutPassword } = user;
      onLogin(userWithoutPassword);
    } else {
      setError('Invalid username or password');
      toast.error('Login failed. Please check your credentials.');
      // Clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="login-container flex justify-center items-center min-h-screen min-w-full bg-gradient-to-br from-blue-500 to-slate-800 p-5m">
      <div className="w-full max-w-md mx-auto p-10 bg-white rounded-xl shadow-2xl animate-fade-in-up">
        <h2 className="text-center text-2xl font-bold text-slate-800 mb-8 pb-4 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-slate-800 after:rounded-md">
          Faculty Feedback System
        </h2>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-600 mb-6 p-3 bg-red-50 rounded-lg border-l-4 border-red-600 text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-slate-800">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-slate-800">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 p-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-900 hover:-translate-y-0.5 transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;