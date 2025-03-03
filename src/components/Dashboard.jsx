import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [faculties, setFaculties] = useState([]);
  const [recentQueries, setRecentQueries] = useState([]);

  useEffect(() => {
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
    <div className="p-8 mt-16">
      <h2 className="mb-6 text-2xl font-bold text-slate-800">Dashboard</h2>
      
      <div className="flex flex-wrap gap-6">
        <div className="flex-1 bg-white rounded-lg p-6 shadow-md min-w-[300px]">
          <h3 className="mb-4 text-lg font-medium text-slate-800 border-b border-gray-100 pb-2">Quick Actions</h3>
          <div className="flex flex-col gap-4">
            <Link to="/feedback" className="anonymous-feedback-btn inline-block bg-blue-500 text-white py-3 px-4 rounded text-center hover:bg-blue-700">
              Give Anonymous Feedback
            </Link>
            <Link to="/forum" className="anonymous-feedback-btn inline-block bg-blue-500 text-white py-3 px-4 rounded text-center hover:bg-blue-700">
              Ask a Question
            </Link>
          </div>
        </div>
        
        <div className="flex-1 bg-white rounded-lg p-6 shadow-md min-w-[300px]">
          <h3 className="mb-4 text-lg font-medium text-slate-800 border-b border-gray-100 pb-2">Faculty List</h3>
          <ul>
            {faculties.map(faculty => (
              <li key={faculty.id} className="py-3 border-b border-gray-100 last:border-b-0">
                <strong className="font-medium">{faculty.name}</strong> - {faculty.subject}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex-1 bg-white rounded-lg p-6 shadow-md min-w-[300px]">
          <h3 className="mb-4 text-lg font-medium text-slate-800 border-b border-gray-100 pb-2">Recent Queries</h3>
          {recentQueries.length > 0 ? (
            <ul>
              {recentQueries.map(query => (
                <li key={query.id} className="py-3 border-b border-gray-100 last:border-b-0">
                  <strong className="font-medium">{query.title}</strong>
                  <p className="text-gray-600">{query.content.substring(0, 100)}...</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent queries available.</p>
          )}
          <Link to="/forum" className="inline-block mt-4 text-blue-500 hover:underline">View All Queries</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;