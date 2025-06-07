import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faArrowLeft, faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';

// Hàm chuyển đổi URL YouTube sang định dạng embed
const convertToEmbedUrl = (url) => {
  const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

function LearningScreen({ level, day, vocabulary, videoUrl, onContinue, onBack }) {
  const [viewedVocab, setViewedVocab] = useState({});

  // Ánh xạ vocabulary từ backend sang cấu trúc mong đợi
  const vocabToDisplay = vocabulary.length > 0
    ? vocabulary.map((item) => ({
        term: item.term,
        description: item.description,
      }))
    : [];

  const handleContinue = () => {
    const allViewed = vocabToDisplay.every((_, index) => viewedVocab[index]);
    if (!allViewed) {
      alert('Please view all vocabulary before continuing!');
      return;
    }
    onContinue();
  };

  const handleBack = () => {
    onBack();
  };

  const handleCheck = (index) => {
    setViewedVocab((prev) => ({ ...prev, [index]: true }));
  };

  // Chuyển đổi videoUrl sang định dạng embed
  const embedVideoUrl = convertToEmbedUrl(videoUrl);

  return (
    <div className="screen">
      <h2>
        <FontAwesomeIcon icon={faBook} /> Day {day} Lesson - {level === 'level_1' ? 'Beginner' : 'Intermediate'}
      </h2>
      <div className="progress">
        <FontAwesomeIcon icon={faBook} /> Level: {level === 'level_1' ? 'Beginner' : 'Intermediate'} | Day: {day}/30
      </div>
      <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
        <iframe
          src={embedVideoUrl} // Sử dụng URL đã chuyển đổi
          title={`Lesson Video Day ${day}`}
          frameBorder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        ></iframe>
        <div
          style={{
            display: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#000',
            color: '#fff',
            textAlign: 'center',
            paddingTop: '20%',
            boxSizing: 'border-box',
          }}
        >
          Video not available. Please use the link below to watch it.
        </div>
        <a
          href={videoUrl ? videoUrl.replace('/embed/', '/watch?v=') : '#'}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', textAlign: 'center', marginTop: '10px', color: '#1e3a8a' }}
        >
          Open video in new tab
        </a>
      </div>
      <div className="vocabulary-list">
        {vocabToDisplay.map((item, index) => (
          <div key={index} className="vocab-item">
            <h3>{item.term}</h3>
            <p className="vocab-description">{item.description}</p>
            <button
              className="check-btn"
              onClick={() => handleCheck(index)}
              disabled={viewedVocab[index]}
            >
              <FontAwesomeIcon icon={faCheck} /> {viewedVocab[index] ? 'Viewed' : 'Mark as Viewed'}
            </button>
          </div>
        ))}
      </div>
      <button className="continue-btn" onClick={handleContinue}>
        Continue to Quiz <FontAwesomeIcon icon={faArrowRight} />
      </button>
      <button className="back-btn" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
    </div>
  );
}

export default LearningScreen;