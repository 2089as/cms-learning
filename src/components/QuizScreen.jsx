import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

/**
 * Hàm chuyển đổi URL YouTube sang định dạng embed.
 * - Nếu là URL YouTube chuẩn, nó sẽ chuyển sang dạng embed.
 * - Nếu là URL dạng khác (như của bạn), nó sẽ được sử dụng trực tiếp,
 * vì bạn đã xác nhận các URL đó hoạt động.
 */
const convertToEmbedUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return ''; // Trả về chuỗi rỗng để iframe không bị lỗi
  }

  // Cố gắng tìm videoId từ các định dạng URL YouTube tiêu chuẩn
  const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
  
  // Nếu tìm thấy videoId chuẩn, tạo URL embed chuẩn
  if (videoIdMatch && videoIdMatch[1]) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
  }
  
  // Nếu không, giả sử URL của bạn hoạt động trực tiếp và trả về chính nó
  return url;
};

function QuizScreen({ level, day, questions, onResult, onBack }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState('');

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
      const selectedOptionValue = selectedAnswers[q._id];
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
        <p>No questions available for this day. Please ensure quizzes are created and loaded correctly.</p>
        <button className="back-btn" onClick={onBack}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const allAnswered = Object.keys(selectedAnswers).length === questions.length;
  
  // Chuyển đổi URL video của câu hỏi hiện tại
  const embedVideoUrl = convertToEmbedUrl(currentQuestion.videoUrl);

  return (
    <div className="screen">
      <h2>
        <FontAwesomeIcon icon={faQuestionCircle} /> Day {day} - Quiz
      </h2>
      <div className="progress">
        Level: {level === 'level_1' ? 'Beginner' : 'Intermediate'} | Day: {day}/30 | Question {currentQuestionIndex + 1}/{questions.length}
      </div>

      <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
        {embedVideoUrl ? (
          <iframe
            key={currentQuestion._id} // Thêm key để React re-render iframe khi video thay đổi
            src={embedVideoUrl}
            title={`Video for Question ${currentQuestionIndex + 1}`}
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          ></iframe>
        ) : (
          <div style={{ background: '#000', color: '#fff', textAlign: 'center', paddingTop: '20%', height: '100%', position: 'absolute', top: 0, left: 0, width: '100%' }}>
             <p>{currentQuestion.videoUrl ? 'Video link is invalid or unsupported.' : 'No video available for this question.'}</p>
          </div>
        )}
      </div>

      <div key={currentQuestion._id} style={{ marginBottom: '15px', marginTop: '1rem' }}>
        <p>Question {currentQuestionIndex + 1}: {currentQuestion.question}</p>
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            className={`option ${selectedAnswers[currentQuestion._id] === option ? 'selected' : ''}`}
            onClick={() => handleAnswerSelect(currentQuestion._id, option)}
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
            disabled={!selectedAnswers[currentQuestion._id]}
          >
            Next Question <FontAwesomeIcon icon={faArrowRight} />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={!allAnswered}>
            Submit <FontAwesomeIcon icon={faArrowRight} />
          </button>
        )}
      </div>

      <button className="back-btn" onClick={onBack} style={{ marginTop: '10px' }}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
    </div>
  );
}

export default QuizScreen;