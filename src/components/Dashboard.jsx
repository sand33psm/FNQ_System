import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [faculties, setFaculties] = useState([]);
  const [recentQueries, setRecentQueries] = useState([]);

  useEffect(() => {
    // Initialize faculty data if not present
    if (!localStorage.getItem('faculties')) {
      const dummyFaculties = [
        { id: 1, name: 'Dr. Robert Smith', subject: 'React Fundamentals' },
        { id: 2, name: 'Prof. Maria Johnson', subject: 'Advanced JavaScript' },
        { id: 3, name: 'Dr. James Wilson', subject: 'Web Development' }
      ];
      localStorage.setItem('faculties', JSON.stringify(dummyFaculties));
      setFaculties(dummyFaculties);
    } else {
      setFaculties(JSON.parse(localStorage.getItem('faculties')));
    }

    // Get recent queries
    const queries = JSON.parse(localStorage.getItem('queries')) || [];
    setRecentQueries(queries.slice(0, 3)); // Get last 3 queries
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Link to="/feedback" className="btn">Give Anonymous Feedback</Link>
            <Link to="/forum" className="btn">Ask a Question</Link>
          </div>
        </div>
        <div className="dashboard-card">
          <h3>Faculty List</h3>
          <ul className="faculty-list">
            {faculties.map(faculty => (
              <li key={faculty.id}>
                <strong>{faculty.name}</strong> - {faculty.subject}
              </li>
            ))}
          </ul>
        </div>
        <div className="dashboard-card">
          <h3>Recent Queries</h3>
          {recentQueries.length > 0 ? (
            <ul className="recent-queries">
              {recentQueries.map(query => (
                <li key={query.id}>
                  <strong>{query.title}</strong>
                  <p>{query.content.substring(0, 100)}...</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent queries available.</p>
          )}
          <Link to="/forum" className="view-all">View All Queries</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;