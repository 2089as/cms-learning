import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol, faPlay, faHistory, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

function HomeScreen({ onStart, onReview }) {
  const [level, setLevel] = useState('');
  const [showError, setShowError] = useState(false);

  const handleLevelChange = (e) => {
    const selectedLevel = e.target.value;
    setLevel(selectedLevel);
    if (showError) setShowError(false);
  };

  const handleStartLearning = () => {
    if (!level) {
      setShowError(true);
      return;
    }
    onStart(level);
  };

  return (
    <div className="screen">
      <h2>
        <FontAwesomeIcon icon={faFutbol} /> Football Sign
      </h2>
      <div className="select">
        <label htmlFor="level-select">Select Level</label>
        <select
          id="level-select"
          onChange={handleLevelChange}
          value={level}
          className={showError ? 'error' : ''}
        >
          <option value="" disabled>
            Select Level
          </option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
        </select>
      </div>
      {showError && (
        <p className="message error">
          <FontAwesomeIcon icon={faExclamationCircle} /> Please select a level before starting!
        </p>
      )}
      <button onClick={handleStartLearning} disabled={!level}>
        <FontAwesomeIcon icon={faPlay} /> Start Learning
      </button>
      <button onClick={() => onReview()}>
        <FontAwesomeIcon icon={faHistory} /> Review Lessons
      </button>
    </div>
  );
}

export default HomeScreen;