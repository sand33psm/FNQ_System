import React, { useState, useEffect } from 'react';

const FeedbackForm = ({ user }) => {
  const [facultyId, setFacultyId] = useState('');
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    // Get faculty list
    const facultyList = JSON.parse(localStorage.getItem('faculties')) || [];
    setFaculties(facultyList);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create feedback object
    const newFeedback = {
      id: Date.now(),
      facultyId: parseInt(facultyId),
      rating,
      feedback: feedbackText,
      timestamp: new Date().toISOString(),
      // Note: We're not storing user information for anonymity
    };
    
    // Save to localStorage
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    feedbacks.push(newFeedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    
    // Reset form and show confirmation
    setFacultyId('');
    setRating(5);
    setFeedbackText('');
    setSubmitted(true);
    
    // Hide confirmation after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="feedback-container">
      <h2>Anonymous Faculty Feedback</h2>
      <p className="feedback-info">
        Your feedback is completely anonymous. Faculty members will not be able to identify you.
      </p>
      
      {submitted && (
        <div className="success-message">
          Thank you for your feedback! It has been submitted anonymously.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Faculty:</label>
          <select 
            value={facultyId} 
            onChange={(e) => setFacultyId(e.target.value)}
            required
          >
            <option value="">-- Select a faculty member --</option>
            {faculties.map(faculty => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name} - {faculty.subject}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Rating (1-10):</label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={rating} 
            onChange={(e) => setRating(parseInt(e.target.value))}
          />
          <span className="rating-display">{rating}/10</span>
        </div>
        
        <div className="form-group">
          <label>Your Feedback:</label>
          <textarea 
            value={feedbackText} 
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Please share your honest feedback about the teaching style, content, and overall experience..."
            required
            rows="5"
          />
        </div>
        
        <button type="submit" id='submit-btn'>Submit Anonymous Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackForm;