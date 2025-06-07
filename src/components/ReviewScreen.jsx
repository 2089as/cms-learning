import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faArrowLeft, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

function ReviewScreen({ completedDays = [], lessons = [], quizzes = [], quizResults = {}, onReview, onBack }) {
  const [selectedDay, setSelectedDay] = useState('');

  const handleReview = (dayNum) => {
    onReview(dayNum);
  };

  const handleBack = () => {
    onBack();
  };

  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  // Sắp xếp mảng completedDays theo thứ tự số học tăng dần
  const sortedCompletedDays = [...completedDays].sort((a, b) => a - b);

  const selectedQuiz = selectedDay ? quizzes.find((q) => q.day === parseInt(selectedDay)) : null;
  const selectedResults = selectedDay ? quizResults[selectedDay] || {} : {};

  console.log('ReviewScreen - Selected Day:', selectedDay, 'Quiz Results:', quizResults, 'Selected Results:', selectedResults);

  return (
    <div className="screen">
      <h2>
        <FontAwesomeIcon icon={faCalendar} /> Review Lessons
      </h2>
      <div className="review-content">
        {completedDays.length === 0 ? (
          <p>No lessons completed yet. Start learning to unlock reviews!</p>
        ) : (
          <>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="day-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>
                Select a day to review:
              </label>
              <select
                id="day-select"
                value={selectedDay}
                onChange={handleDayChange}
                style={{
                  padding: '8px',
                  fontSize: '16px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  cursor: 'pointer',
                }}
              >
                <option value="">-- Select Day --</option>
                {/* Sử dụng mảng đã sắp xếp ở đây */}
                {sortedCompletedDays.map((day) => (
                  <option key={day} value={day}>
                    Day {day}
                  </option>
                ))}
              </select>
            </div>

            {selectedDay ? (
              selectedQuiz && selectedQuiz.questions && Array.isArray(selectedQuiz.questions) ? (
                <div className="quiz-review-content">
                  <h3>Quiz Results for Day {selectedDay}</h3>
                  <button
                    className="review-lesson-btn"
                    onClick={() => handleReview(parseInt(selectedDay))}
                    title="Go to lesson content for this day"
                    style={{ // Thêm style cho nút Review Lesson
                      padding: '10px 15px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginBottom: '15px'
                    }}
                  >
                    <FontAwesomeIcon icon={faCalendar} /> Review Lesson for Day {selectedDay}
                  </button>
                  {selectedQuiz.questions.map((question) => {
                    const selectedAnswer = selectedResults[question.id];
                    const isCorrect = selectedAnswer === question.answer;
                    return (
                      <div
                        key={question.id}
                        className={`quiz-review-item ${isCorrect ? 'correct' : 'incorrect'}`}
                        style={{
                          padding: '10px',
                          marginBottom: '10px',
                          borderRadius: '5px',
                          backgroundColor: isCorrect ? '#e6ffed' : '#ffe6e6',
                        }}
                      >
                        <div>
                          <strong>Question {question.id}:</strong> {question.question}
                        </div>
                        <div>
                          <strong>Your Answer:</strong> {selectedAnswer || 'Not answered'}
                          {isCorrect ? (
                            <FontAwesomeIcon icon={faCheck} style={{ marginLeft: '5px', color: 'green' }} />
                          ) : (
                            <FontAwesomeIcon icon={faTimes} style={{ marginLeft: '5px', color: 'red' }} />
                          )}
                        </div>
                        {!isCorrect && (
                          <div>
                            <strong>Correct Answer:</strong> {question.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p>No quiz results available for this day. Please ensure quizzes are loaded correctly.</p>
              )
            ) : (
              <p>Please select a day to view quiz results.</p>
            )}
          </>
        )}
      </div>
      <button
        className="back-btn"
        onClick={handleBack}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
    </div>
  );
}

export default ReviewScreen;