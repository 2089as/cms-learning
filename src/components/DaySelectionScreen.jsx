import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function DaySelectionScreen({ lessons, progress, onSelectDay, onBack, level }) {
  const handleSelectDay = (day) => {
    onSelectDay(day);
  };

  const handleBack = () => {
    onBack();
  };

  console.log('Lessons in DaySelectionScreen:', lessons); // Debug

  const daysToDisplay = lessons
    .filter((lesson) => {
      const dayValue = typeof lesson.day === 'number' ? lesson.day : undefined;
      console.log('Lesson day value:', lesson.day, 'Valid:', dayValue !== undefined && dayValue > 0 && dayValue <= 30); // Debug
      return dayValue !== undefined && dayValue > 0 && dayValue <= 30;
    })
    .map((lesson) => ({ day: lesson.day }));

  return (
    <div className="screen">
      <h2>
        <FontAwesomeIcon icon={faCalendar} /> Select Day
      </h2>
      <div className="progress">
        Level: {level || 'Not selected'} | Current Day: {progress.day || 'Not set'}/30
      </div>
      {daysToDisplay.length === 0 ? (
        <p>No lessons available. Please ensure lessons have a valid 'day' field (1-30).</p>
      ) : (
        <div className="day-selection-grid">
          {daysToDisplay.map((item, index) => (
            <div
              key={index}
              className={`day-selection-item ${progress.completed.includes(item.day) ? 'completed' : ''}`}
              onClick={() => handleSelectDay(item.day)}
            >
              <FontAwesomeIcon icon={faCalendar} /> Day {item.day} {progress.completed.includes(item.day) ? '(Completed)' : ''}
            </div>
          ))}
        </div>
      )}
      <button className="back-btn" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
    </div>
  );
}

export default DaySelectionScreen;