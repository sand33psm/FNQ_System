import React, { useState, useEffect } from 'react';

const QueryForum = ({ user }) => {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [newQueryTitle, setNewQueryTitle] = useState('');
  const [newQueryContent, setNewQueryContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [showNewQueryForm, setShowNewQueryForm] = useState(false);

  useEffect(() => {
    // Load queries from localStorage
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
    <div className="query-forum">
      <h2>Query Forum</h2>
      
      <div className="forum-actions">
        <button 
          onClick={() => setShowNewQueryForm(true)}
          className="new-query-btn"
        >
          Ask a New Question
        </button>
      </div>
      
      {showNewQueryForm && (
        <div className="new-query-form">
          <h3>Ask a New Question</h3>
          <form onSubmit={handleSubmitQuery}>
            <div className="form-group">
              <label>Title:</label>
              <input 
                type="text" 
                value={newQueryTitle} 
                onChange={(e) => setNewQueryTitle(e.target.value)}
                placeholder="Enter a clear, concise title for your question"
                required
              />
            </div>
            <div className="form-group">
              <label>Question Details:</label>
              <textarea 
                value={newQueryContent} 
                onChange={(e) => setNewQueryContent(e.target.value)}
                placeholder="Describe your question or problem in detail..."
                required
                rows="5"
              />
            </div>
            <div className="form-buttons">
              <button type="submit">Post Question</button>
              <button 
                type="button" 
                onClick={() => setShowNewQueryForm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="forum-container">
        <div className="query-list">
          <h3>All Questions</h3>
          {queries.length > 0 ? (
            <ul>
              {queries.map(query => (
                <li 
                  key={query.id} 
                  className={selectedQuery && selectedQuery.id === query.id ? 'selected' : ''}
                  onClick={() => setSelectedQuery(query)}
                >
                  <h4>{query.title}</h4>
                  <div className="query-meta">
                    <span>By: {query.userName}</span>
                    <span>{formatDate(query.timestamp)}</span>
                    <span>{query.replies.length} replies</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-queries">No questions have been posted yet.</p>
          )}
        </div>
        
        <div className="query-detail">
          {selectedQuery ? (
            <>
              <div className="query-header">
                <h3>{selectedQuery.title}</h3>
                <div className="query-meta">
                  <span>Posted by: {selectedQuery.userName}</span>
                  <span>{formatDate(selectedQuery.timestamp)}</span>
                </div>
              </div>
              
              <div className="query-content">
                <p>{selectedQuery.content}</p>
              </div>
              
              <div className="query-replies">
                <h4>Replies ({selectedQuery.replies.length})</h4>
                {selectedQuery.replies.length > 0 ? (
                  <ul>
                    {selectedQuery.replies.map(reply => (
                      <li key={reply.id}>
                        <div className="reply-meta">
                          <span>{reply.userName}</span>
                          <span>{formatDate(reply.timestamp)}</span>
                        </div>
                        <p>{reply.content}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-replies">No replies yet. Be the first to respond!</p>
                )}
              </div>
              
              <div className="reply-form">
                <h4>Add Your Response</h4>
                <form onSubmit={handleSubmitReply}>
                  <textarea 
                    value={replyContent} 
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Type your response here..."
                    required
                    rows="3"
                    id='reply-msg'
                  />
                  <button type="submit" id='post-reply'>Post Reply</button>
                </form>
              </div>
            </>
          ) : (
            <div className="no-query-selected">
              <p>Select a question from the list to view details and replies.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryForum;