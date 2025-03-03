import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = ({ user }) => {
  const [faculties, setFaculties] = useState([]);
  const [recentQueries, setRecentQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('');
  const [availableSubjects, setAvailableSubjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch faculty data from mock API (using users endpoint as mock faculty data)
        const facultyResponse = await axios.get('/users');
        
        // Transform the API response to match our faculty structure
        const transformedFaculties = facultyResponse.data.slice(0, 10).map(user => ({
          id: user.id,
          name: `Dr. ${user.name}`,
          subject: getRandomSubject(),
          email: user.email,
          phone: user.phone,
          department: getRandomDepartment()
        }));
        
        // Save to localStorage and state
        localStorage.setItem('faculties', JSON.stringify(transformedFaculties));
        setFaculties(transformedFaculties);
        
        // Extract unique subjects for filtering
        const subjects = [...new Set(transformedFaculties.map(f => f.subject))];
        setAvailableSubjects(subjects);
        
        // Get recent queries
        const queries = JSON.parse(localStorage.getItem('queries')) || [];
        if (queries.length === 0) {
          // Fetch some mock queries if none exist
          const queriesResponse = await axios.get('/posts', { params: { _limit: 5 } });
          const transformedQueries = queriesResponse.data.map(post => ({
            id: post.id,
            title: post.title.substring(0, 50),
            content: post.body,
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
            userId: post.userId,
            userName: `User ${post.userId}`,
            replies: []
          }));
          
          localStorage.setItem('queries', JSON.stringify(transformedQueries));
          setRecentQueries(transformedQueries.slice(0, 3));
        } else {
          setRecentQueries(queries.slice(0, 3));
        }
        
        // toast.success('Dashboard data loaded successfully');
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // toast.error('Failed to load dashboard data');
        
        // Fallback to dummy data if API fails
        if (!localStorage.getItem('faculties')) {
          const dummyFaculties = [
            { id: 1, name: 'Dr. Robert Smith', subject: 'React Fundamentals', department: 'Computer Science' },
            { id: 2, name: 'Prof. Maria Johnson', subject: 'Advanced JavaScript', department: 'Information Technology' },
            { id: 3, name: 'Dr. James Wilson', subject: 'Web Development', department: 'Computer Science' }
          ];
          localStorage.setItem('faculties', JSON.stringify(dummyFaculties));
          setFaculties(dummyFaculties);
          setAvailableSubjects([...new Set(dummyFaculties.map(f => f.subject))]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Function to filter faculties by subject
  const filteredFaculties = filterSubject 
    ? faculties.filter(faculty => faculty.subject === filterSubject)
    : faculties;

  // Helper functions for random data generation
  function getRandomSubject() {
    const subjects = [
      'React Fundamentals', 
      'Advanced JavaScript', 
      'Web Development',
      'Data Structures',
      'Database Systems',
      'Machine Learning',
      'Computer Networks',
      'Mobile Development',
      'Cloud Computing',
      'Cybersecurity'
    ];
    return subjects[Math.floor(Math.random() * subjects.length)];
  }
  
  function getRandomDepartment() {
    const departments = [
      'Computer Science',
      'Information Technology',
      'Software Engineering',
      'Data Science',
      'Artificial Intelligence'
    ];
    return departments[Math.floor(Math.random() * departments.length)];
  }

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
        
        <div className="flex-1 bg-white rounded-lg p-6 shadow-md min-w-[350px]">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
            <h3 className="text-lg font-medium text-slate-800">Faculty List</h3>
            <div className="flex items-center">
              <label htmlFor="subject-filter" className="mr-2 text-sm">Filter by Subject:</label>
              <select
                id="subject-filter"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="p-1 border border-gray-300 rounded text-sm"
              >
                <option value="">All Subjects</option>
                {availableSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
          
          {loading ? (
            <p className="text-center py-4">Loading faculty data...</p>
          ) : (
            <ul>
              {filteredFaculties.map(faculty => (
                <li key={faculty.id} className="py-3 border-b border-gray-100 last:border-b-0">
                  <strong className="font-medium">{faculty.name}</strong>
                  <p className="text-sm text-gray-600">{faculty.subject} - {faculty.department}</p>
                </li>
              ))}
              {filteredFaculties.length === 0 && (
                <p className="text-gray-500 italic py-2">No faculty members match the selected filter.</p>
              )}
            </ul>
          )}
        </div>
        
        <div className="flex-1 bg-white rounded-lg p-6 shadow-md min-w-[300px]">
          <h3 className="mb-4 text-lg font-medium text-slate-800 border-b border-gray-100 pb-2">Recent Queries</h3>
          {loading ? (
            <p className="text-center py-4">Loading recent queries...</p>
          ) : recentQueries.length > 0 ? (
            <ul>
              {recentQueries.map(query => (
                <li key={query.id} className="py-3 border-b border-gray-100 last:border-b-0">
                  <strong className="font-medium">{query.title}</strong>
                  <p className="text-gray-600">{query.content.substring(0, 100)}...</p>
                  <div className="mt-1 text-xs text-gray-500">
                    {new Date(query.timestamp).toLocaleDateString()} by {query.userName}
                  </div>
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