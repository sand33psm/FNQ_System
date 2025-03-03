import React, { useState, useEffect } from 'react';

const FeedbackForm = ({ user }) => {
  const [facultyId, setFacultyId] = useState('');
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
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
    <div className="feedabck-form-container max-w-2xl mx-auto mt-24 mb-8 p-8 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center">
      <h2 className="text-center text-2xl font-bold text-slate-800 mb-6 mt-10">Anonymous Faculty Feedback</h2>
      
      <p className="mb-6 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500 w-full">
        Your feedback is completely anonymous. Faculty members will not be able to identify you.
      </p>
      
      {submitted && (
        <div className="mb-6 p-3 bg-green-50 text-green-800 rounded-lg border-l-4 border-green-500 w-full">
          Thank you for your feedback! It has been submitted anonymously.
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-6">
          <label className="block mb-2 font-medium">Select Faculty:</label>
          <select 
            value={facultyId} 
            onChange={(e) => setFacultyId(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 focus:outline-none"
          >
            <option value="">-- Select a faculty member --</option>
            {faculties.map(faculty => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name} - {faculty.subject}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 font-medium">Rating (1-10):</label>
          <div className="flex items-center">
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={rating} 
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="w-full"
            />
            <span className="ml-4 font-bold">{rating}/10</span>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 font-medium">Your Feedback:</label>
          <textarea 
            value={feedbackText} 
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Please share your honest feedback about the teaching style, content, and overall experience..."
            required
            rows="5"
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:border-blue-500 focus:outline-none resize-y"
          />
        </div>
        
        <button 
          type="submit" 
          id="submit-btn" 
          className="annonymous-feedback-submit-btn bg-blue-500 text-black border-none py-3 px-6 rounded hover:bg-blue-700 text-base font-medium cursor-pointer -mb-4 "
        >
          Submit Anonymous Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;