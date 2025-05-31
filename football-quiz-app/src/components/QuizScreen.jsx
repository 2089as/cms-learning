import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

function QuizScreen({ level, day, questions, onResult, onBack }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState('');

const introVideo = 'https://www.youtube.com/embed/Tw1fCcNaKhc';
  const handleAnswerSelect = (questionId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
    setFeedback('');
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setFeedback('');
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setFeedback('');
    }
  };

  const handleSubmit = () => {
    const correctAnswers = questions.filter((q) => selectedAnswers[q.id] === q.answer).length;
    setFeedback(correctAnswers > 3 ? 'Congratulations! You passed!' : 'Please review this lesson!');
    setTimeout(() => onResult(correctAnswers, selectedAnswers), 1000);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <div className="screen">
      <h2>
        <FontAwesomeIcon icon={faQuestionCircle} /> Day {day} - Quiz
      </h2>
      <div className="progress">
        <FontAwesomeIcon icon={faQuestionCircle} /> Level: {level} | Day: {day}/30
      </div>
      <div className="video-container">
        <iframe
          src={introVideo}
          title="Quiz Introduction"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div key={currentQuestion.id} style={{ marginBottom: '15px' }}>
        <p>Question {currentQuestionIndex + 1}: {currentQuestion.question}</p>
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            className={`option ${selectedAnswers[currentQuestion.id] === option ? 'selected' : ''}`}
            onClick={() => handleAnswerSelect(currentQuestion.id, option)}
            style={{ margin: '5px' }}
          >
            {option}
          </button>
        ))}
      </div>
      {feedback && (
        <div style={{ color: feedback.includes('Congratulations') ? '#22c55e' : '#ef4444', margin: '10px 0' }}>
          {feedback}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          className="back-btn"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Previous Question
        </button>
        {currentQuestionIndex < questions.length - 1 ? (
          <button
            onClick={handleNextQuestion}
            disabled={!selectedAnswers[currentQuestion.id]}
          >
            Next Question <FontAwesomeIcon icon={faArrowRight} />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={!allAnswered}>
            Submit <FontAwesomeIcon icon={faArrowRight} />
          </button>
        )}
      </div>
      <button className="back-btn" onClick={onBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
    </div>
  );
}

export default QuizScreen;