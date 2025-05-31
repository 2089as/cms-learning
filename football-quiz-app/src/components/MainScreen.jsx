import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

function MainScreen({ onContinue }) {
  const [level, setLevel] = useState('');
  const [showError, setShowError] = useState(false);

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
    if (showError) setShowError(false);
  };

  const handleSubmit = () => {
    if (!level) {
      setShowError(true);
      return;
    }
    onContinue(level);
  };

  return (
    <div className="screen">
      <h2>
        <FontAwesomeIcon icon={faPlay} /> Main Screen
      </h2>
      <div className="select">
        <label htmlFor="level-select">Select Level</label>
        <select
          id="level-select"
          value={level}
          onChange={handleLevelChange}
          className={showError ? 'error' : ''}
        >
          <option value="">Select Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
        </select>
      </div>
      {showError && (
        <p className="message error">
          <FontAwesomeIcon icon={faExclamationCircle} /> Please select a level before continuing!
        </p>
      )}
      <button onClick={handleSubmit} disabled={!level}>
        Continue <FontAwesomeIcon icon={faPlay} />
      </button>
    </div>
  );
}

export default MainScreen;