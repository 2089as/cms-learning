import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faArrowLeft, faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';

function LearningScreen({ level, day, vocabulary, onContinue, onBack }) {
  const [viewedVocab, setViewedVocab] = useState({});

  const defaultVocabulary = [
    {
      term: 'Dribble',
      video: 'https://www.youtube.com/embed/naEccnjzLxM', // Updated to new video
      description:
        'A technique to maneuver the ball past opponents using skillful footwork, often performed by attacking players to bypass defenders.',
    },
    {
      term: 'Tackle',
      video: 'https://www.youtube.com/embed/q5GNyiin5mY', // Kept existing video, adjust if needed
      description:
        'The act of taking the ball from an opponent using the feet or body, typically done by defenders to stop an attack.',
    },
    {
      term: 'Free Kick',
      video: 'https://www.youtube.com/embed/XcGfzM2r3tg',
      description:
        'A free kick awarded when a team commits a foul outside the penalty area, which can be direct or indirect depending on the foul.',
    },
    {
      term: 'Corner Kick',
      video: 'https://www.youtube.com/embed/0zG9L3i5l1M',
      description:
        'A kick taken from the corner of the field when the ball goes over the goal line, last touched by the defending team, often used to create scoring opportunities.',
    },
  ];

  const vocabToDisplay = vocabulary || defaultVocabulary;

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

  return (
    <div className="screen">
      <h2>
        <FontAwesomeIcon icon={faBook} /> Day {day} Lesson - {level === 'beginner' ? 'Beginner' : 'Intermediate'}
      </h2>
      <div className="progress">
        <FontAwesomeIcon icon={faBook} /> Level: {level === 'beginner' ? 'Beginner' : 'Intermediate'} | Day: {day}/30
      </div>
      <div className="vocabulary-list">
        {vocabToDisplay.map((item, index) => (
          <div key={index} className="vocab-item">
            <h3>{item.term}</h3>
            <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe
                src={`${item.video}?rel=0`} // Added ?rel=0 to prevent related videos
                title={item.term}
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
                href={item.video.replace('/embed/', '/watch?v=')}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textAlign: 'center', marginTop: '10px', color: '#1e3a8a' }}
              >
                Open video in new tab
              </a>
            </div>
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