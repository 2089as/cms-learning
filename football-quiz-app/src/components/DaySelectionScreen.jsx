import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function DaySelectionScreen({ lessons, progress, onSelectDay, onBack }) {
  const handleSelectDay = (day) => {
    onSelectDay(day);
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <div className="screen">
      <h2>
        <FontAwesomeIcon icon={faCalendar} /> Select Day
      </h2>
      <div className="progress">
        Level: {progress.level || 'Not selected'} | Current Day: {progress.day}/30
      </div>
      <div className="day-selection-grid">
        {lessons.map((lesson) => (
          <div
            key={lesson.day}
            className={`day-selection-item ${progress.completed.includes(lesson.day) ? 'completed' : ''}`}
            onClick={() => handleSelectDay(lesson.day)}
          >
            <FontAwesomeIcon icon={faCalendar} /> Day {lesson.day} {progress.completed.includes(lesson.day) ? '(Completed)' : ''}
          </div>
        ))}
      </div>
      <button className="back-btn" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
    </div>
  );
}

export default DaySelectionScreen;