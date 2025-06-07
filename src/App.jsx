import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { 
  getLessons, createUser, createCertificate, getQuizzes,
  getUserProgress, updateOrCreateUserProgress, 
  getUserByDeviceId // <-- Đảm bảo dòng này đã được import
} from './services/app'; 

function App() {
  // Các state ban đầu sẽ được load từ backend sau khi có user_id
  const [screen, setScreen] = useState('home');
  const [level, setLevel] = useState('');
  const [day, setDay] = useState(1);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState({ day: 1, completed: [], passedDays: {} });
  const [quizResults, setQuizResults] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' }); // Giữ lại state này nếu bạn muốn hiển thị thông báo dưới dạng UI
  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Trạng thái tải ban đầu của toàn ứng dụng

  const hasLoadedInitialProgress = useRef(false); // Biến cờ để theo dõi việc initial load đã hoàn tất chưa

  // Lấy lessons từ API theo level
  useEffect(() => {
    const fetchLessons = async () => {
      if (!level || level === '') {
        setLessons([]);
        return;
      }
      setIsLoadingLessons(true);
      try {
        console.log(`[App.jsx] Fetching lessons for level: ${level}`);
        const data = await getLessons(level);
        console.log('[App.jsx] Fetched lessons:', data);
        if (Array.isArray(data)) {
          setLessons(data);
        } else {
          console.warn('[App.jsx] Fetched lessons data is not an array:', data);
          setLessons([]);
        }
      } catch (error) {
        console.error('[App.jsx] Error fetching lessons:', error.message);
        setNotification({ message: 'Error fetching lessons: ' + error.message, type: 'error' }); // Vẫn sử dụng notification state nếu muốn
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      } finally {
        setIsLoadingLessons(false);
      }
    };
    fetchLessons();
  }, [level]);

  // Lấy quizzes từ API theo level
  useEffect(() => {
    const fetchQuizzesData = async () => {
      if (!level || level === '') {
        setQuizzes([]);
        return;
      }
      setIsLoadingQuizzes(true);
      try {
        console.log(`[App.jsx] Attempting to fetch quizzes for level: ${level}`);
        const data = await getQuizzes(level);
        console.log('[App.jsx] Fetched quizzes data (raw from API):', data);

        if (Array.isArray(data)) {
          const formattedQuizzes = data.map(quizItem => {
            return {
              ...quizItem,
              questions: quizItem.questions.map(q => ({
                ...q,
                id: q._id || `q-${quizItem.day}-${q.question.slice(0, 10)}`,
                answer: q.options[q.correctAnswer] 
              }))
            };
          });
          setQuizzes(formattedQuizzes); 
          console.log('[App.jsx] Formatted quizzes for frontend:', formattedQuizzes);

        } else {
          console.warn('[App.jsx] Fetched quizzes data is not an array:', data);
          setQuizzes([]);
        }

      } catch (error) {
        console.error('[App.jsx] Error fetching quizzes:', error.message);
        setNotification({ message: 'Error fetching quizzes: ' + error.message, type: 'error' });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
        setQuizzes([]);
      } finally {
        setIsLoadingQuizzes(false);
      }
    };
    fetchQuizzesData();
  }, [level]);

  // Load progress và quizResults từ localStorage (chỉ là fallback, không còn là nguồn chính)
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('progress');
      if (savedProgress) setProgress(JSON.parse(savedProgress));
      const savedQuizResults = localStorage.getItem('quizResults');
      if (savedQuizResults) setQuizResults(JSON.parse(savedQuizResults));
    } catch (error) {
      console.error('Error loading progress from localStorage (fallback):', error.message);
      setNotification({ message: 'Error loading progress: ' + error.message, type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  }, []);

  // Lưu progress và quizResults vào localStorage (chỉ là fallback, không còn là nguồn chính)
  useEffect(() => {
    try {
      localStorage.setItem('progress', JSON.stringify(progress));
      localStorage.setItem('quizResults', JSON.stringify(quizResults));
    } catch (error) {
      console.error('Error saving progress to localStorage (fallback):', error.message);
      setNotification({ message: 'Error saving progress: ' + error.message, type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  }, [progress, quizResults]);

  // --- HÀM KHỞI TẠO NGƯỜI DÙNG VÀ TẢI TIẾN ĐỘ TỪ BACKEND ---
  const initializeUserAndProgress = useCallback(async () => {
    // Biến cờ này giúp hàm chỉ chạy một lần khi khởi tạo ứng dụng
    if (hasLoadedInitialProgress.current) {
      return; 
    }

    try {
      let currentUser = null;
      let deviceId = localStorage.getItem('deviceId');

      // 1. Lấy hoặc tạo deviceId trong localStorage
      if (!deviceId) {
        deviceId = `device-${Date.now()}`;
        localStorage.setItem('deviceId', deviceId);
        console.log('New deviceId generated and saved:', deviceId);
      } else {
        console.log('Existing deviceId from localStorage:', deviceId);
      }

      // 2. Thử tìm người dùng theo deviceId
      try {
        currentUser = await getUserByDeviceId(deviceId); // <-- Hàm này cần được import
        console.log('Existing user found with this deviceId:', currentUser);
      } catch (findError) {
        // Nếu getUserByDeviceId ném lỗi và lỗi đó là 'User not found' (hoặc status 404)
        if (findError.message && findError.message.includes('User not found')) {
          console.log('User not found for this deviceId. Creating a new user...');
          try {
            currentUser = await createUser({ device_id: deviceId, email: '' });
            console.log('New user created successfully:', currentUser);
          } catch (createError) {
            console.error('Failed to create new user, possibly duplicate device_id:', createError);
            setNotification({ message: 'Failed to create user: ' + createError.message, type: 'error' });
            setTimeout(() => setNotification({ message: '', type: '' }), 3000);
            throw createError; // Ném lỗi để khối catch bên ngoài xử lý
          }
        } else {
          // Ném lỗi nếu không phải lỗi 'User not found' mà là lỗi khác
          console.error('Error during getUserByDeviceId:', findError);
          setNotification({ message: 'Error finding user: ' + findError.message, type: 'error' });
          setTimeout(() => setNotification({ message: '', type: '' }), 3000);
          throw findError;
        }
      }
      
      // Nếu không có currentUser sau các bước trên, có nghĩa là có lỗi nghiêm trọng
      if (!currentUser || !currentUser._id) {
          console.error('Failed to get or create a user. Cannot proceed with progress initialization.');
          setNotification({ message: 'Failed to identify user for progress.', type: 'error' });
          setTimeout(() => setNotification({ message: '', type: '' }), 3000);
          throw new Error('Failed to identify or create user.');
      }

      setUser(currentUser); // Set user vào state

      // 3. Lấy hoặc tạo tiến độ của người dùng
      let userProgressData = null;
      if (currentUser && currentUser._id) {
        try {
          userProgressData = await getUserProgress(currentUser._id); // <-- Hàm này cần được import
          console.log('Fetched user progress:', userProgressData);
        } catch (progressFetchError) {
          // Ghi log chi tiết lỗi, không ném lỗi nếu là 404
          console.warn('Error fetching user progress (might not exist):', progressFetchError.message);
          setNotification({ message: 'Error fetching progress: ' + progressFetchError.message, type: 'error' });
          setTimeout(() => setNotification({ message: '', type: '' }), 3000);
        }
      }

      // Nếu không có tiến độ hoặc tiến độ rỗng, khởi tạo mặc định và lưu lên backend
      if (!userProgressData) {
        console.log('No existing progress for user, initializing default progress and saving to backend.');
        const defaultProgress = {
          user_id: currentUser._id,
          current_level: '', 
          current_day: 1,
          current_screen: 'home',
          completed_days: [],
          passed_days_details: {},
          quiz_results: {}
        };
        userProgressData = await updateOrCreateUserProgress(currentUser._id, defaultProgress); // <-- Hàm này cần được import
        console.log('Created default user progress on backend:', userProgressData);
      }

      // Cập nhật state của ứng dụng với dữ liệu tiến độ
      if (userProgressData) {
        setLevel(userProgressData.current_level || '');
        setDay(userProgressData.current_day || 1);
        setScreen(userProgressData.current_screen || 'home');
        setProgress({
          day: userProgressData.current_day || 1,
          completed: userProgressData.completed_days || [],
          passedDays: userProgressData.passed_days_details || {},
        });
        setQuizResults(userProgressData.quiz_results || {});
      }
      
    } catch (error) {
      console.error('Initial setup failed:', error); 
      setNotification({ message: 'Initial setup failed: ' + error.message, type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      setLevel('');
      setDay(1);
      setScreen('home');
    } finally {
      setIsInitialLoading(false);
      hasLoadedInitialProgress.current = true; // Đảm bảo chỉ chạy một lần
    }
  }, [user]); 

  // Chạy hàm khởi tạo khi component mount lần đầu
  useEffect(() => {
    initializeUserAndProgress();
  }, [initializeUserAndProgress]);

  // --- LƯU TRẠNG THÁI ỨNG DỤNG LÊN BACKEND MỖI KHI CÓ THAY ĐỔI ---
  useEffect(() => {
    // Không lưu nếu user chưa được load hoặc đang ở màn hình loading ban đầu
    if (isInitialLoading || !user || !user._id || !level) {
      return;
    }

    const saveProgressToBackend = async () => {
      const progressToSave = {
        user_id: user._id,
        current_level: level,
        current_day: day,
        current_screen: screen,
        completed_days: progress.completed,
        passed_days_details: progress.passedDays,
        quiz_results: quizResults,
      };
      try {
        await updateOrCreateUserProgress(user._id, progressToSave); // <-- Hàm này cần được import
        console.log('Progress saved to backend successfully!', progressToSave);
      } catch (error) {
        console.error('Failed to save progress to backend:', error);
        setNotification({ message: 'Error saving progress to server: ' + error.message, type: 'error' });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      }
    };

    const handler = setTimeout(() => {
      saveProgressToBackend();
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
  }, [user, level, day, screen, progress, quizResults, isInitialLoading]); 

  const validateLevel = useCallback(() => {
    if (!level || level === '') {
      setNotification({ message: 'Please select a level first!', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      setScreen('home');
      return false;
    }
    return true;
  }, [level]); 

  const handleStart = useCallback((selectedLevel) => {
    const mappedLevel = selectedLevel === 'beginner' ? 'level_1' : 'level_2';
    setLevel(mappedLevel);
    setScreen('daySelection');
  }, []);

  const handleContinue = useCallback(() => {
    if (!validateLevel()) return;
    if (day <= 30) {
      if (progress.passedDays[day]) {
        const nextDay = day + 1;
        setDay(nextDay);
        setProgress((prev) => ({ ...prev, day: nextDay }));
        if (nextDay > 30 && progress.completed.length === 30) {
          setScreen('certificate');
          setNotification({ message: 'Congratulations! You have completed all 30 days!', type: 'success' });
          setTimeout(() => setNotification({ message: '', type: '' }), 3000);
        } else if (nextDay > 30) {
          setNotification({ message: 'You must complete all 30 days to receive the certificate!', type: 'error' });
          setTimeout(() => setNotification({ message: '', type: '' }), 3000);
          setScreen('daySelection');
        } else {
          setScreen('learning');
        }
      } else {
        setScreen('quiz');
      }
    }
  }, [day, progress.passedDays, progress.completed, validateLevel]); 

  const handleQuizResult = useCallback((newScore, selectedAnswers) => {
    setScore(newScore);
    setQuizResults((prev) => ({ ...prev, [day]: selectedAnswers }));
    if (newScore > 3) { 
      setProgress((prev) => ({
        ...prev,
        completed: Array.from(new Set([...prev.completed, day])),
        passedDays: { ...prev.passedDays, [day]: true },
      }));
      setScreen('result');
    } else {
      setProgress((prev) => ({
        ...prev,
        passedDays: { ...prev.passedDays, [day]: false },
      }));
      setNotification({ message: 'You did not pass the quiz. Please try again!', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      setScreen('result');
    }
  }, [day]); 

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
    if (progress.completed.includes(dayNum)) {
      setDay(dayNum);
      setScreen('learning');
    } else {
      setNotification({ message: 'You need to pass the quiz for this day before reviewing!', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  }, [level, progress.completed, validateLevel]); 

  const handleReviewScreen = useCallback(() => {
    if (progress.completed.length > 0) {
      setScreen('review');
    } else {
      setNotification({ message: 'You haven’t completed any days to review! Please complete a quiz first.', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  }, [progress.completed]); 

  const handleQuizReview = useCallback(() => {
    if (score > 3 || progress.completed.includes(day)) {
      setScreen('quizReview');
    } else {
      setNotification({ message: 'You need to pass the quiz for this day before reviewing the results!', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      setScreen('quiz');
    }
  }, [day, score, progress.completed]); 

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
    setUser(null); // Reset user, sẽ tạo lại user mới khi load
    try {
      // Xóa tiến độ khỏi localStorage khi reset
      localStorage.removeItem('progress');
      localStorage.removeItem('quizResults');
      localStorage.removeItem('deviceId'); // Xóa deviceId để tạo user mới
    } catch (error) {
      console.error('Error resetting progress in localStorage:', error.message);
      setNotification({ message: 'Error resetting progress: ' + error.message, type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
    setScreen('home');
    setNotification({ message: 'Learning progress has been reset!', type: 'success' });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    // Sau khi reset, initializeUserAndProgress sẽ chạy lại
  }, []); 

  const handleBack = useCallback(() => {
    if (screen === 'learning') setScreen('daySelection');
    else if (screen === 'quiz') setScreen('learning');
    else if (screen === 'result') setScreen('quiz');
    else if (screen === 'certificate') setScreen('result');
    else if (screen === 'review') setScreen('home');
    else if (screen === 'quizReview') setScreen('result');
    else if (screen === 'daySelection') setScreen('home');
  }, [screen]);

  const toggleSidebar = useCallback((isOpen) => {
    setIsSidebarOpen(isOpen);
  }, []);

  async function handleReceiveCertificate() {
    if (!user || !user._id) {
      setNotification({ message: 'User not found. Please restart the app.', type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
      return;
    }
    try {
      const certificateData = {
        user_id: user._id,
        level_id: level,
        pdf_url: 'http://example.com/certificate.pdf',
      };
      await createCertificate(certificateData);
      setNotification({ message: 'Certificate sent to your email!', type: 'success' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    } catch (error) {
      setNotification({ message: 'Error sending certificate: ' + error.message, type: 'error' });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  }

  // --- Đảm bảo hiển thị màn hình loading ban đầu ---
  if (isInitialLoading) {
    return (
      <div className="app">
        <div className="main-content loading-screen">
          <p>Loading application data...</p>
        </div>
      </div>
    );
  }

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
          <div className={`notification ${notification.type}`}>{notification.message}</div>
        )}
        {screen === 'home' && <HomeScreen onStart={handleStart} onReview={handleReviewScreen} />}
        
        {screen === 'daySelection' && level && !isLoadingLessons && lessons.length > 0 && (
          <DaySelectionScreen
            lessons={lessons}
            progress={progress}
            onSelectDay={handleSelectDay}
            onBack={handleBack}
            level={level}
          />
        )}
        {screen === 'daySelection' && isLoadingLessons && (
          <div className="screen">
            <p>Loading lessons...</p>
          </div>
        )}
        {screen === 'daySelection' && level && !isLoadingLessons && lessons.length === 0 && (
          <div className="screen">
            <p>No lessons available for this level.</p>
            <button className="back-btn" onClick={handleBack}>
              <FontAwesomeIcon icon={faArrowLeft} /> Back
            </button>
          </div>
        )}

        {screen === 'learning' && level && (
          <LearningScreen
            level={level}
            day={day}
            vocabulary={lessons.find((l) => l.day === day)?.vocabulary || []}
            videoUrl={lessons.find((l) => l.day === day)?.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'} 
            onContinue={handleContinue}
            onBack={handleBack}
          />
        )}

        {screen === 'quiz' && level && !isLoadingQuizzes && (
          <QuizScreen
            level={level}
            day={day}
            questions={quizzes.find((q) => q.day === day)?.questions || []}
            onResult={handleQuizResult}
            onBack={handleBack}
            videoUrl={lessons.find((l) => l.day === day)?.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
          />
        )}
        {screen === 'quiz' && isLoadingQuizzes && (
          <div className="screen">
            <p>Loading quizzes...</p>
          </div>
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
            onReceiveCertificate={day === 30 && progress.completed.length === 30 ? handleReceiveCertificate : null}
          />
        )}

        {screen === 'certificate' && user && (
          <CertificateScreen
            user={user}
            onBack={handleBack}
            onRestart={handleRestart}
            level={level}
          />
        )}

        {screen === 'review' && (
          <ReviewScreen
            completedDays={progress.completed}
            lessons={lessons}
            quizzes={quizzes}
            quizResults={quizResults}
            onReview={handleReview}
            onBack={handleBack}
          />
        )}

        {screen === 'quizReview' && (
          <QuizReviewScreen
            questions={quizzes.find((q) => q.day === day)?.questions || []}
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