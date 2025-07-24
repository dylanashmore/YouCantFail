import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './style.css';
import TopicButton from './Buttons/topicButton';
import HistoryButton from './Buttons/historyButton';
import SidebarButtons from './Buttons/sidebarButtons';
import { getSolutionPdfForQuestion, TOPIC_PDFS } from './Handlers/pdfHandler';
import CustomPdfJsViewer from './CustomPdfJsViewer';
import ExamModePage from './Pages/examModePage';
import AboutPage from './Pages/AboutPage';
import PointCounter from './Buttons/pointCounter';


function MainPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [hasEnded, setHasEnded] = useState(true);
  const [time, setTime] = useState({ minutes: 10, seconds: 0 });
  const [pdfUrl, setPdfUrl] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [pdfHistory, setPdfHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userAttemptUrl, setUserAttemptUrl] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const intervalRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (pdfUrl) {
      setPdfHistory((prev) => {
        if (prev[0] === pdfUrl) return prev;
        const filtered = prev.filter((item) => item !== pdfUrl);
        return [pdfUrl, ...filtered].slice(0, 20);
      });
    }
  }, [pdfUrl]);

  const handleStart = () => {
    setTime({ minutes: 10, seconds: 0 });
    setHasEnded(false);
    setIsRunning(true);
    setShowSolution(false);
    setUserAttemptUrl(null);

    let allPdfs = [];
    if (selectedTopics.length === 0) {
      allPdfs = Object.values(TOPIC_PDFS).flat();
    } else {
      allPdfs = selectedTopics.flatMap(topic =>
        Object.keys(TOPIC_PDFS)
          .filter(key => key.endsWith('/' + topic))
          .flatMap(key => TOPIC_PDFS[key])
      );
    }

    if (allPdfs.length > 0) {
      const newPdf = allPdfs[Math.floor(Math.random() * allPdfs.length)];
      setPdfUrl(newPdf);
    }
  };

  const handlePause = () => setIsRunning(false);
  const handleResume = () => setIsRunning(true);

  const handleEnd = () => {
    if (pdfUrl) {
      setUserAttemptUrl(pdfUrl);
      const solutionPdf = getSolutionPdfForQuestion(pdfUrl);
      if (solutionPdf) {
        setPdfUrl(solutionPdf);
        setShowSolution(true);
      }
    }
    setIsRunning(false);
    setHasEnded(true);
    setTime({ minutes: 0, seconds: 0 });
  };

  useEffect(() => {
    if (!isRunning || hasEnded) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        const { minutes, seconds } = prev;
        if (minutes === 0 && seconds === 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return prev;
        }
        if (seconds === 0) return { minutes: minutes - 1, seconds: 59 };
        return { minutes, seconds: seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, hasEnded]);

  const format = (num) => String(num).padStart(2, '0');

  return (
    <div>

      <div className="top-bar">
        <div className="left-section">
          {/* Sidebar toggle button */}
      <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(true)}>☰</button>

      {/* Sidebar menu */}
      <aside className={`sidebar${sidebarOpen ? ' sidebar--open' : ''}`}>
        <button className="sidebar_close-btn" onClick={() => setSidebarOpen(false)}>×</button>
        <nav className="sidebar_menu">
          <h2>Menu</h2>
          <SidebarButtons />
        </nav>
      </aside>
          <HistoryButton history={pdfHistory} onSelect={setPdfUrl} />
          <TopicButton
            onPdfSelect={setPdfUrl}
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
          />
        </div>
        <div className="center-section">
          <div className="timer">
            <span className="timer-icon">⏱️</span>
            Time left: {format(time.minutes)}:{format(time.seconds)}
          </div>
        </div>
        <div className="right-section">
          <PointCounter />
          {!hasEnded ? (
            <>
              <button onClick={isRunning ? handlePause : handleResume}>
                {isRunning ? 'Pause' : 'Resume'}
              </button>
              <button onClick={handleEnd}>End</button>
            </>
          ) : (
            <button onClick={handleStart}>Start</button>
          )}
        </div>
      </div>

      <div className="pdf-viewer-container" ref={viewerRef}>
        <CustomPdfJsViewer fileUrl={userAttemptUrl || pdfUrl || '/instructions.pdf'} />

        {hasEnded && userAttemptUrl && (
          <div style={{ position: 'absolute', top: '20px', right: '200px', zIndex: 10 }}>
            <button
              className="compare-btn"
              onClick={() => setShowSolution(s => !s)}
              title={showSolution ? 'Compare My Work' : 'Show Solution'}
            >
              ⇄
            </button>
          </div>
        )}

        {hasEnded && (
          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              zIndex: 2,
              background: 'rgba(255,255,255,0.98)',
              pointerEvents: showSolution ? 'auto' : 'none',
              opacity: showSolution ? 1 : 0,
              transition: 'opacity 0.2s'
            }}
          >
            <CustomPdfJsViewer fileUrl={pdfUrl} />
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/exam-mode" element={<ExamModePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
