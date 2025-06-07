// Sidebar.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faQuestionCircle, faHistory, faSignOutAlt, faFutbol } from '@fortawesome/free-solid-svg-icons';
import '../Sidebar.css';

function Sidebar({ onLearn, onQuiz, onReview, onRestart, toggleSidebar }) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = (e, callback) => {
    e.preventDefault();
    callback();
    setIsActive(false);
    toggleSidebar(false);
  };

  const handleToggleSidebar = () => {
    setIsActive(!isActive);
    toggleSidebar(!isActive);
  };

  return (
    <>
      <button className="menu-toggle" onClick={handleToggleSidebar} aria-label="Toggle sidebar">
        <span className={`hamburger ${isActive ? 'active' : ''}`}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </span>
      </button>
      <div className={`sidebar ${isActive ? 'active' : ''}`}>
        <h2>
          <FontAwesomeIcon icon={faFutbol} className="header-icon" /> Football Sign
        </h2>
        <nav>
          <a href="#" onClick={(e) => handleClick(e, onLearn)}>
            <FontAwesomeIcon icon={faBook} /> Learn
          </a>
          <a href="#" onClick={(e) => handleClick(e, onQuiz)}>
            <FontAwesomeIcon icon={faQuestionCircle} /> Quiz
          </a>
          <a href="#" onClick={(e) => handleClick(e, onReview)}>
            <FontAwesomeIcon icon={faHistory} /> Review
          </a>
          <a href="#" className="logout" onClick={(e) => handleClick(e, onRestart)}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </a>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;