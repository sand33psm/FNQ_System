import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import "../App.css";

const QueryForum = ({ user }) => {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [newQueryTitle, setNewQueryTitle] = useState('');
  const [newQueryContent, setNewQueryContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [showNewQueryForm, setShowNewQueryForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        
        // Check if we have stored queries
        const storedQueries = JSON.parse(localStorage.getItem('queries')) || [];
        
        if (storedQueries.length > 0) {
          setQueries(storedQueries);
        } else {
          // Fetch queries from API if none exist
          const response = await axios.get('/posts', { params: { _limit: 10 } });
          
          // Transform the API response to match our queries structure
          const transformedQueries = await Promise.all(response.data.map(async (post) => {
            // Get some comments for each post to use as replies
            const commentsRes = await axios.get(`/posts/${post.id}/comments`, { params: { _limit: 3 } });
            
            // Transform comments to replies
            const replies = commentsRes.data.map(comment => ({
              id: comment.id,
              content: comment.body,
              timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
              userId: comment.id,
              userName: comment.name.split(' ')[0]
            }));
            
            return {
              id: post.id,
              title: post.title,
              content: post.body,
              timestamp: new Date(Date.now() - Math.floor(Math.random() * 20000000)).toISOString(),
              userId: post.userId,
              userName: `User ${post.userId}`,
              replies: replies
            };
          }));
          
          // Save to localStorage and state
          localStorage.setItem('queries', JSON.stringify(transformedQueries));
          setQueries(transformedQueries);
        }
        
        // toast.success('Queries loaded successfully');
      } catch (error) {
        console.error('Error fetching queries:', error);
        // toast.error('Failed to load queries');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQueries();
  }, []);

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create new query
      const newQuery = {
        id: Date.now(),
        title: newQueryTitle,
        content: newQueryContent,
        timestamp: new Date().toISOString(),
        userId: user.id,
        userName: user.name,
        replies: []
      };
      
      // Send to API (just for demonstration)
      await axios.post('/posts', {
        title: newQueryTitle,
        body: newQueryContent,
        userId: user.id
      });
      
      // Save to localStorage
      const updatedQueries = [...queries, newQuery];
      setQueries(updatedQueries);
      localStorage.setItem('queries', JSON.stringify(updatedQueries));
      
      // Reset form
      setNewQueryTitle('');
      setNewQueryContent('');
      setShowNewQueryForm(false);
      
      toast.success('Your question has been posted');
    } catch (error) {
      console.error('Error posting query:', error);
      toast.error('Failed to post your question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    
    if (!selectedQuery) return;
    setLoading(true);
    
    try {
      // Create new reply
      const newReply = {
        id: Date.now(),
        content: replyContent,
        timestamp: new Date().toISOString(),
        userId: user.id,
        userName: user.name
      };
      
      // Send to API (just for demonstration)
      await axios.post(`/posts/${selectedQuery.id}/comments`, {
        name: user.name,
        email: 'user@example.com',
        body: replyContent
      });
      
      // Add reply to selected query
      const updatedQuery = {
        ...selectedQuery,
        replies: [...selectedQuery.replies, newReply]
      };
      
      // Update queries list
      const updatedQueries = queries.map(q => 
        q.id === selectedQuery.id ? updatedQuery : q
      );
      
      // Save to localStorage and update state
      setQueries(updatedQueries);
      setSelectedQuery(updatedQuery);
      localStorage.setItem('queries', JSON.stringify(updatedQueries));
      
      // Reset form
      setReplyContent('');
      
      toast.success('Your reply has been added');
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post your reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Search and sort functionality
  const filteredQueries = queries
    .filter(query => 
      query.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      query.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (sortBy === 'oldest') {
        return new Date(a.timestamp) - new Date(b.timestamp);
      } else if (sortBy === 'most-replies') {
        return b.replies.length - a.replies.length;
      }
      return 0;
    });

  return (
    <div className="p-8 mt-16">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Query Forum</h2>
      
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <button 
          onClick={() => setShowNewQueryForm(true)}
          id='post-query'
          className="bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Ask a New Question'}
        </button>
        
        <div className="flex gap-4 flex-wrap">
          <div className="relative">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg pl-10 focus:border-blue-500 focus:outline-none"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-replies">Most Replies</option>
          </select>
        </div>
      </div>
      
      {showNewQueryForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="ask-questin-btn text-xl font-bold mb-4 text-black">Ask a New Question</h3>
          <form onSubmit={handleSubmitQuery}>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Title:</label>
              <input 
                type="text" 
                value={newQueryTitle} 
                onChange={(e) => setNewQueryTitle(e.target.value)}
                placeholder="Enter a clear, concise title for your question"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                disabled={loading}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Question Details:</label>
              <textarea 
                value={newQueryContent} 
                onChange={(e) => setNewQueryContent(e.target.value)}
                placeholder="Describe your question or problem in detail..."
                required
                rows="5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-y"
                disabled={loading}
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button 
                type="submit" 
                className="annonymous-feedback-submit-btn bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Post Question'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowNewQueryForm(false)}
                className="annonymous-feedback-submit-btn bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {loading && !showNewQueryForm && (
        <div className="text-center p-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4">All Questions</h3>
          {filteredQueries.length > 0 ? (
            <ul>
              {filteredQueries.map(query => (
                <li 
                  key={query.id} 
                  className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 
                    ${selectedQuery && selectedQuery.id === query.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                  onClick={() => setSelectedQuery(query)}
                >
                  <h4 className="font-medium mb-2">{query.title}</h4>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <span>By: {query.userName}</span>
                    <span>{formatDate(query.timestamp)}</span>
                    <span>{query.replies.length} replies</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : searchTerm ? (
            <p className="text-gray-500 italic">No questions match your search.</p>
          ) : (
            <p className="text-gray-500 italic">No questions have been posted yet.</p>
          )}
        </div>
        
        <div className="md:col-span-2 bg-white rounded-lg p-6 shadow-md">
          {selectedQuery ? (
            <>
              <div className="border-b pb-4 mb-6">
                <h3 className="text-xl font-bold mb-2">{selectedQuery.title}</h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Posted by: {selectedQuery.userName}</span>
                  <span>{formatDate(selectedQuery.timestamp)}</span>
                </div>
              </div>
              
              <div className="mb-8">
                <p>{selectedQuery.content}</p>
              </div>
              
              <div className="mb-8">
                <h4 className="text-lg font-medium border-b pb-2 mb-4">Replies ({selectedQuery.replies.length})</h4>
                {selectedQuery.replies.length > 0 ? (
                  <ul>
                    {selectedQuery.replies.map(reply => (
                      <li key={reply.id} className="p-4 border-b last:border-b-0">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>{reply.userName}</span>
                          <span>{formatDate(reply.timestamp)}</span>
                        </div>
                        <p>{reply.content}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No replies yet. Be the first to respond!</p>
                )}
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Add Your Response</h4>
                <form onSubmit={handleSubmitReply} className="relative">
                  <textarea 
                    id="reply-msg"
                    value={replyContent} 
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Type your response here..."
                    required
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-y placeholder:text-center placeholder:leading-[3rem] placeholder:text-gray-400 placeholder:italic"
                    disabled={loading}
                  />
                  <button 
                    type="submit" 
                    id="post-reply"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4"
                    disabled={loading}
                  >
                    {loading ? 'Posting...' : 'Post Reply'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500 text-center">
              <p>Select a question from the list to view details and replies.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryForum;