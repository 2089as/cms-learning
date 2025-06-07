import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

// Hàm chuyển đổi URL YouTube sang định dạng embed
const convertToEmbedUrl = (url) => {
  const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

function QuizScreen({ level, day, questions, onResult, onBack, videoUrl }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState('');

  // Chuyển đổi videoUrl sang định dạng embed
  const embedVideoUrl = convertToEmbedUrl(videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ');

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
    let correctAnswers = 0;
    questions.forEach((q) => {
      const selectedOptionValue = selectedAnswers[q.id];
      const correctAnswerIndex = q.correctAnswer;
      if (selectedOptionValue === q.options[correctAnswerIndex]) {
        correctAnswers++;
      }
    });
    setFeedback(correctAnswers > 3 ? 'Congratulations! You passed!' : 'Please review this lesson!');
    setTimeout(() => onResult(correctAnswers, selectedAnswers), 1000);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="screen">
        <h2>
          <FontAwesomeIcon icon={faQuestionCircle} /> Day {day} - Quiz
        </h2>
        <div className="progress">
          <FontAwesomeIcon icon={faQuestionCircle} /> Level: {level} | Day: {day}/30
        </div>
        <p>No questions available for this day. Please ensure quizzes are created and loaded correctly.</p>
        <button className="back-btn" onClick={onBack}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <div className="screen">
      <h2>
        <FontAwesomeIcon icon={faQuestionCircle} /> Day {day} - Quiz
      </h2>
      <div className="progress">
        <FontAwesomeIcon icon={faQuestionCircle} /> Level: {level} | Day: {day}/30 | Question {currentQuestionIndex + 1}/{questions.length}
      </div>
      <div className="video-container">
        <iframe
          src={embedVideoUrl} // Sử dụng URL đã chuyển đổi
          title="Quiz Introduction"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div key={currentQuestion.id} style={{ marginBottom: '15px' }}>
        <p>Question {currentQuestionIndex + 1}: {currentQuestion.question}</p>
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
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