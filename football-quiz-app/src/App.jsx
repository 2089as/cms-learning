import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/Sidebar';
import HomeScreen from './components/HomeScreen';
import LearningScreen from './components/LearningScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import CertificateScreen from './components/CertificateScreen';
import ReviewScreen from './components/ReviewScreen';
import QuizReviewScreen from './components/QuizReviewScreen';
import DaySelectionScreen from './components/DaySelectionScreen';
import './App.css';

function App() {
  const [screen, setScreen] = useState('home');
  const [level, setLevel] = useState('');
  const [day, setDay] = useState(1);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState({ day: 1, completed: [], passedDays: {} });
  const [quizResults, setQuizResults] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const lessons = {
    beginner: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      vocabulary: [
        {
          term: `Dribble Day ${i + 1}`,
          video: `https://www.youtube.com/embed/naEccnjzLxM`, // Updated to new video
          description: 'A technique to maneuver the ball past opponents using skillful footwork.',
        },
        {
          term: `Tackle Day ${i + 1}`,
          video: `https://www.youtube.com/embed/q5GNyiin5mY`,
          description: 'The act of taking the ball from an opponent using the feet or body.',
        },
        {
          term: `Free Kick Day ${i + 1}`,
          video: `https://www.youtube.com/embed/XcGfzM2r3tg`,
          description: 'A free kick awarded when a team commits a foul outside the penalty area.',
        },
        {
          term: `Corner Kick Day ${i + 1}`,
          video: `https://www.youtube.com/embed/0zG9L3i5l1M`,
          description: 'A kick taken from the corner of the field when the ball goes over the goal line.',
        },
      ],
    })),
    intermediate: Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      vocabulary: [
        {
          term: `Dribble Technique Day ${i + 1}`,
          video: `https://www.youtube.com/embed/naEccnjzLxM`, // Updated to new video
          description: 'Advanced dribbling techniques to bypass multiple defenders at once.',
        },
        {
          term: `Sliding Tackle Day ${i + 1}`,
          video: `https://www.youtube.com/embed/Nx4iRT0nM50`,
          description: 'A technique to take the ball by sliding, requiring precision and safety.',
        },
        {
          term: `Direct Free Kick Day ${i + 1}`,
          video: `https://www.youtube.com/embed/XcGfzM2r3tg`,
          description: 'A direct free kick that can be shot straight at the goal without a teammate touching the ball.',
        },
        {
          term: `Corner Kick Strategy Day ${i + 1}`,
          video: `https://www.youtube.com/embed/0zG9L3i5l1M`,
          description: 'Tactical coordination in a corner kick to create effective scoring opportunities.',
        },
      ],
    })),
  };

  const quizzes = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    questions: [
      { id: 1, question: `Who protects the goal (Day ${i + 1})?`, options: ['Goalkeeper', 'Striker', 'Defender'], answer: 'Goalkeeper' },
      { id: 2, question: `When does a penalty occur (Day ${i + 1})?`, options: ['Foul in the penalty area', 'Scoring a goal', 'Substitution'], answer: 'Foul in the penalty area' },
      { id: 3, question: `Who is the main attacking player (Day ${i + 1})?`, options: ['Goalkeeper', 'Striker', 'Midfielder'], answer: 'Striker' },
      { id: 4, question: `What is offside (Day ${i + 1})?`, options: ['A foul', 'An illegal position', 'Scoring a goal'], answer: 'An illegal position' },
      { id: 5, question: `What is the maximum number of players on the field (Day ${i + 1})?`, options: ['9', '10', '11'], answer: '11' },
      { id: 6, question: `What does a red card mean (Day ${i + 1})?`, options: ['Warning', 'Sent off', 'Extra time'], answer: 'Sent off' },
      { id: 7, question: `Who won the 2018 World Cup (Day ${i + 1})?`, options: ['France', 'Brazil', 'Germany'], answer: 'France' },
    ],
  }));

  const validateLevel = useCallback(() => {
    if (!level) {
      setNotification({ message: 'Please select a level first!', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      setScreen('home');
      return false;
    }
    return true;
  }, [level]);

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('progress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
      const savedQuizResults = localStorage.getItem('quizResults');
      if (savedQuizResults) {
        console.log('Loaded quizResults from localStorage:', JSON.parse(savedQuizResults));
        setQuizResults(JSON.parse(savedQuizResults));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setNotification({ message: 'Error loading progress. Starting fresh.', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  }, []);

  useEffect(() => {
    try {
      console.log('Saving quizResults to localStorage:', quizResults);
      localStorage.setItem('progress', JSON.stringify(progress));
      localStorage.setItem('quizResults', JSON.stringify(quizResults));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      setNotification({ message: 'Error saving progress.', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  }, [progress, quizResults]);

  const showNotification = useCallback((message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  }, []);

  const handleStart = useCallback((selectedLevel) => {
    setLevel(selectedLevel);
    setScreen('daySelection');
  }, []);

  const handleContinue = useCallback(() => {
    if (!validateLevel()) return;
    if (day <= 30) {
      if (progress.passedDays[day]) {
        const nextDay = day + 1;
        setDay(nextDay);
        setProgress((prev) => ({
          ...prev,
          day: nextDay,
        }));
        if (nextDay > 30 && progress.completed.length === 30) {
          setScreen('certificate');
          showNotification('Congratulations! You have completed all 30 days!', 'success');
        } else if (nextDay > 30) {
          showNotification('You must complete all 30 days to receive the certificate!', 'error');
          setScreen('daySelection');
        } else {
          setScreen('learning');
        }
      } else {
        setScreen('quiz');
      }
    }
  }, [day, progress.passedDays, progress.completed, showNotification, validateLevel]);

  const handleQuizResult = useCallback((newScore, selectedAnswers) => {
    console.log('handleQuizResult - Day:', day, 'Score:', newScore, 'Answers:', selectedAnswers);
    setScore(newScore);
    setQuizResults((prev) => {
      const updatedQuizResults = {
        ...prev,
        [day]: selectedAnswers,
      };
      console.log('Updated quizResults:', updatedQuizResults);
      return updatedQuizResults;
    });

    if (newScore > 3) {
      setProgress((prev) => {
        const updatedProgress = {
          ...prev,
          completed: Array.from({ length: day }, (_, i) => i + 1),
          passedDays: { ...prev.passedDays, [day]: true },
        };
        try {
          localStorage.setItem('progress', JSON.stringify(updatedProgress));
        } catch (error) {
          console.error('Error saving progress:', error);
          showNotification('Error saving progress.', 'error');
        }
        return updatedProgress;
      });
      setScreen('result');
    } else {
      setProgress((prev) => ({
        ...prev,
        passedDays: { ...prev.passedDays, [day]: false },
      }));
      showNotification('You did not pass the quiz. Please try again!', 'error');
      setScreen('result');
    }
  }, [day, showNotification]);

  const handleRetryQuiz = useCallback(() => {
    setScreen('quiz');
  }, []);

  const handleLearn = useCallback(() => {
    if (!validateLevel()) return;
    setScreen('daySelection');
  }, [validateLevel]);

  const handleQuiz = useCallback(() => {
    if (!validateLevel()) return;
    setScreen('quiz');
  }, [validateLevel]);

  const handleReview = useCallback((dayNum) => {
    if (!validateLevel()) return;
    console.log('handleReview - Day:', dayNum, 'Level:', level, 'Completed Days:', progress.completed);
    if (progress.completed.includes(dayNum)) {
      setDay(dayNum);
      setScreen('learning');
    } else {
      showNotification('You need to pass the quiz for this day before reviewing!', 'error');
    }
  }, [level, progress.completed, showNotification, validateLevel]);

  const handleReviewScreen = useCallback(() => {
    if (progress.completed.length > 0) {
      setScreen('review');
    } else {
      showNotification('You haven’t completed any days to review! Please complete a quiz first.', 'error');
    }
  }, [progress.completed, showNotification]);

  const handleQuizReview = useCallback(() => {
    if (score > 3 || progress.completed.includes(day)) {
      setScreen('quizReview');
    } else {
      showNotification('You need to pass the quiz for this day before reviewing the results!', 'error');
      setScreen('quiz');
    }
  }, [day, score, progress.completed, showNotification]);

  const handleSelectDay = useCallback((selectedDay) => {
    if (!validateLevel()) return;
    setDay(selectedDay);
    setScreen('learning');
  }, [validateLevel]);

  const handleRestart = useCallback(() => {
    setLevel('');
    setDay(1);
    setScore(0);
    setProgress({ day: 1, completed: [], passedDays: {} });
    setQuizResults({});
    try {
      localStorage.setItem('progress', JSON.stringify({ day: 1, completed: [], passedDays: {} }));
      localStorage.setItem('quizResults', JSON.stringify({}));
    } catch (error) {
      console.error('Error resetting localStorage:', error);
      showNotification('Error resetting progress.', 'error');
    }
    setScreen('home');
    showNotification('Learning progress has been reset!', 'success');
  }, [showNotification]);

  const handleBack = useCallback(() => {
    if (screen === 'learning') setScreen('daySelection');
    if (screen === 'quiz') setScreen('learning');
    if (screen === 'result') setScreen('quiz');
    if (screen === 'certificate') setScreen('result');
    if (screen === 'review') setScreen('home');
    if (screen === 'quizReview') setScreen('result');
    if (screen === 'daySelection') setScreen('home');
  }, [screen]);

  const toggleSidebar = useCallback((isOpen) => {
    setIsSidebarOpen(isOpen);
  }, []);

  return (
    <div className="app">
      <Sidebar
        onLearn={handleLearn}
        onQuiz={handleQuiz}
        onReview={handleReviewScreen}
        onRestart={handleRestart}
        toggleSidebar={toggleSidebar}
      />
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        {notification.message && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
        {screen === 'home' && <HomeScreen onStart={handleStart} onReview={handleReviewScreen} />}
        {screen === 'daySelection' && level && (
          <DaySelectionScreen
            lessons={lessons[level] || []}
            progress={progress}
            onSelectDay={handleSelectDay}
            onBack={handleBack}
          />
        )}
        {screen === 'learning' && level && (
          <LearningScreen
            level={level}
            day={day}
            vocabulary={lessons[level][day - 1]?.vocabulary || []}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        )}
        {screen === 'learning' && !level && (
          <div className="screen">
            <p>Please select a level to review lessons.</p>
            <button className="back-btn" onClick={handleBack}>
              <FontAwesomeIcon icon={faArrowLeft} /> Back
            </button>
          </div>
        )}
        {screen === 'quiz' && level && (
          <QuizScreen
            level={level}
            day={day}
            questions={quizzes[day - 1].questions}
            onResult={handleQuizResult}
            onBack={handleBack}
          />
        )}
        {screen === 'result' && (
          <ResultScreen
            score={score}
            total={7}
            day={day}
            onBack={handleBack}
            onQuizReview={handleQuizReview}
            onRetry={score <= 3 ? handleRetryQuiz : null}
            passed={score > 3}
            onReceiveCertificate={day === 30 && progress.completed.length === 30 ? () => setScreen('certificate') : null}
          />
        )}
        {screen === 'certificate' && (
          <CertificateScreen onBack={handleBack} onRestart={handleRestart} level={level} />
        )}
        {screen === 'review' && (
          <ReviewScreen
            completedDays={progress.completed}
            lessons={lessons[level] || []}
            quizzes={quizzes}
            quizResults={quizResults}
            onReview={handleReview}
            onBack={handleBack}
          />
        )}
        {screen === 'quizReview' && (
          <QuizReviewScreen
            questions={quizzes[day - 1].questions}
            selectedAnswers={quizResults[day] || {}}
            onBack={handleBack}
            onReview={() => handleReview(day)}
          />
        )}
      </div>
    </div>
  );
}

export default App;