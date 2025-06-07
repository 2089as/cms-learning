import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faArrowLeft, faBook } from '@fortawesome/free-solid-svg-icons';

function QuizReviewScreen({ questions, selectedAnswers, onBack, onReview }) {
  const handleBack = () => {
    onBack();
  };

  const handleReviewLesson = () => {
    onReview();
  };

  return (
    <div className="screen">
      <h2>
        <FontAwesomeIcon icon={faCheckCircle} /> Quiz Review
      </h2>
      {questions.map((q) => {
        const userAnswer = selectedAnswers[q.id]; // Giá trị string người dùng đã chọn
        // `q.answer` giờ đây sẽ là chuỗi đáp án đúng (từ App.jsx)
        const isCorrect = userAnswer === q.answer; 
        return (
          <div key={q.id} className={`quiz-review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
            <p>{q.question}</p>
            <p>Your answer: {userAnswer || 'Not answered'}</p>
            <p>Correct answer: {q.answer}</p> 
            <FontAwesomeIcon icon={isCorrect ? faCheckCircle : faTimesCircle} style={{ color: isCorrect ? '#22c55e' : '#ef4444' }} />
          </div>
        );
      })}
      <button onClick={handleReviewLesson}>
        <FontAwesomeIcon icon={faBook} /> Review Lesson
      </button>
      <button className="back-btn" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
    </div>
  );
}

export default QuizReviewScreen;