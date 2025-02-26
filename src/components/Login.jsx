import React, { useState, useEffect } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Initialize dummy user data if not present
    if (!localStorage.getItem('users')) {
      const dummyUsers = [
        { id: 1, username: 'adi', password: 'test', role: 'trainee', name: 'Adinath Panchal' },
        { id: 2, username: 'sai', password: 'test', role: 'trainee', name: 'Sai Upase' },
        { id: 3, username: 'shweta', password: 'test', role: 'trainee', name: 'Shweta Jadhav' }
      ];
      localStorage.setItem('users', JSON.stringify(dummyUsers));
      setUsers(dummyUsers);
    } else {
      setUsers(JSON.parse(localStorage.getItem('users')));
    }
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
      // Clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Faculty Feedback System</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;