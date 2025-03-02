import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = ({ onLogout, user }) => {
  return (
    <nav className="navbar">
      <div className="logo">Faculty Feedback System</div>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/feedback">Give Feedback</Link>
        <Link to="/forum">Query Forum</Link>
      </div>
      <div className="user-info">
        <span>Welcome, {user.name}</span>
        <button onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;