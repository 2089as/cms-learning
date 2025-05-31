import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faArrowLeft, faHistory, faRedo, faCertificate } from '@fortawesome/free-solid-svg-icons';

function ResultScreen({ score, total, day, onBack, onQuizReview, onRetry, passed, onReceiveCertificate }) {
  const handleBack = () => {
    onBack();
  };

  const handleQuizReview = () => {
    onQuizReview();
  };

  const handleRetry = () => {
    onRetry();
  };

  const handleReceiveCertificate = () => {
    if (onReceiveCertificate) onReceiveCertificate();
  };

  const percentage = (score / total) * 100;

  return (
    <div className="screen">
      <h2>
        <FontAwesomeIcon icon={faTrophy} /> Results for Day {day}
      </h2>
      <h2>Score: {score} / {total}</h2>
      <p>Percentage: {percentage}%</p>
      {passed ? (
        <p className="message success">Congratulations! You passed the quiz!</p>
      ) : (
        <p className="message error">You need to score above 50% (4/7) to pass. Try again!</p>
      )}
      {passed && (
        <button onClick={handleQuizReview}>
          <FontAwesomeIcon icon={faHistory} /> Review Answers
        </button>
      )}
      {!passed && onRetry && (
        <button onClick={handleRetry}>
          <FontAwesomeIcon icon={faRedo} /> Retry Quiz
        </button>
      )}
      {day === 30 && passed && onReceiveCertificate && (
        <button onClick={handleReceiveCertificate}>
          <FontAwesomeIcon icon={faCertificate} /> Receive Certificate
        </button>
      )}
      <button className="back-btn" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
    </div>
  );
}

export default ResultScreen;