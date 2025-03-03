import React, { useState, useEffect } from 'react';
import "../App.css"

const QueryForum = ({ user }) => {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [newQueryTitle, setNewQueryTitle] = useState('');
  const [newQueryContent, setNewQueryContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [showNewQueryForm, setShowNewQueryForm] = useState(false);

  useEffect(() => {
    const storedQueries = JSON.parse(localStorage.getItem('queries')) || [];
    setQueries(storedQueries);
  }, []);

  const handleSubmitQuery = (e) => {
    e.preventDefault();
    
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
    
    // Save to localStorage
    const updatedQueries = [...queries, newQuery];
    setQueries(updatedQueries);
    localStorage.setItem('queries', JSON.stringify(updatedQueries));
    
    // Reset form
    setNewQueryTitle('');
    setNewQueryContent('');
    setShowNewQueryForm(false);
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    
    if (!selectedQuery) return;
    
    // Create new reply
    const newReply = {
      id: Date.now(),
      content: replyContent,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name
    };
    
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
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-8 mt-16">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Query Forum</h2>
      
      <div className="mb-6">
        <button 
          onClick={() => setShowNewQueryForm(true)}
          id='post-reply'
          className="bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-700"
        >
          Ask a New Question
        </button>
      </div>
      
      {showNewQueryForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4">Ask a New Question</h3>
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
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button type="submit" className="annonymous-feedback-submit-btn bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
                Post Question
              </button>
              <button 
                type="button" 
                onClick={() => setShowNewQueryForm(false)}
                className="annonymous-feedback-submit-btn bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4">All Questions</h3>
          {queries.length > 0 ? (
            <ul>
              {queries.map(query => (
                <li 
                  key={query.id} 
                  className={`p-4 border-b cursor-pointer transition-colors hover:bg-gray-50 
                    ${selectedQuery && selectedQuery.id === query.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                  onClick={() => setSelectedQuery(query)}
                >
                  <h4 className="font-medium mb-2">{query.title}</h4>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>By: {query.userName}</span>
                    <span>{formatDate(query.timestamp)}</span>
                    <span>{query.replies.length} replies</span>
                  </div>
                </li>
              ))}
            </ul>
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
                  />
                  <button 
                    type="submit" 
                    id="post-reply"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 absolute bottom-[-20px] left-[90px]"
                  >
                    Post Reply
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