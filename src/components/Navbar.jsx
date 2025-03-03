import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout, user }) => {
  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center bg-slate-800 text-white px-8 py-4 shadow-md z-10">
      {/* <div className="text-2xl font-bold">Faculty Feedback System</div> */}
      <Link to="/" className="nav-headings text-2xl font-bold">Faculty Feedback System</Link>
      
      <div className="flex gap-6">
        <Link to="/dashboard" className="nav-headings text-white font-medium hover:underline">Dashboard</Link>
        <Link to="/feedback" className="nav-headings text-white font-medium hover:underline">Give Feedback</Link>
        <Link to="/forum" className="nav-headings text-white font-medium hover:underline">Query Forum</Link>
      </div>
      
      <div className="flex items-center gap-4">
        <span>Welcome, {user.name}</span>
        <button 
          onClick={onLogout} 
          className="bg-transparent border border-white text-blue-800 px-4 py-2 rounded cursor-pointer hover:bg-white/10 "
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;