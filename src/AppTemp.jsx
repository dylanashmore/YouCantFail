import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import TopicButton from './Buttons/topicButton';
import HistoryButton from './Buttons/historyButton';
import { getSolutionPdfForQuestion, TOPIC_PDFS } from './Handlers/pdfHandler';
import CustomPdfJsViewer from './CustomPdfJsViewer';
import SidebarButtons from './Buttons/sidebarButtons';

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [hasEnded, setHasEnded] = useState(true);
  const [time, setTime] = useState({ minutes: 10, seconds: 0 });
  const [pdfUrl, setPdfUrl] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [pdfHistory, setPdfHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const intervalRef = useRef(null);
  const viewerRef = useRef(null);

  // Track PDF history
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

    let allPdfs = [];
    if (selectedTopics.length === 0) {
      // No topics selected: use all PDFs from all topics
      allPdfs = Object.values(TOPIC_PDFS).flat();
    } else {
      // Topics selected: use PDFs from selected topics only
      allPdfs = selectedTopics.flatMap(topic =>
        Object.keys(TOPIC_PDFS)
          .filter(key => key.endsWith('/' + topic))
          .flatMap(key => TOPIC_PDFS[key])
      );
    }

    console.log('Selected topics:', selectedTopics);
    console.log('Available PDFs:', allPdfs);

    if (allPdfs.length > 0) {
      const newPdf = allPdfs[Math.floor(Math.random() * allPdfs.length)];
      setPdfUrl(newPdf);
      console.log('Chosen PDF:', newPdf);
    } else {
      console.log('No PDFs available for the selected topics.');
    }
  };

  // Handlers for timer controls
  const handlePause = () => setIsRunning(false);
  const handleResume = () => setIsRunning(true);

  const handleEnd = () => {
    if (pdfUrl) {
      const solutionPdf = getSolutionPdfForQuestion(pdfUrl);
      if (solutionPdf) {
        setPdfUrl(solutionPdf);
        console.log('Loaded solution PDF:', solutionPdf);
      } else {
        console.log('No matching solution PDF found for:', pdfUrl);
      }
    }
    setIsRunning(false);
    setHasEnded(true);
    setTime({ minutes: 0, seconds: 0 });
  };

  // Timer logic
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
    <div className="app-root">
      <header className="top-bar">
        <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
        <div className="top-bar_left">
          <HistoryButton history={pdfHistory} onSelect={setPdfUrl} />
          <TopicButton
            onPdfSelect={setPdfUrl}
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
          />
        </div>
        <div className="top-bar_center">
          <span className="timer-icon">⏱️</span>
          Time left: {format(time.minutes)}:{format(time.seconds)}
        </div>
        <div className="top-bar_right">
          {!hasEnded ? (
            <>
              <button onClick={isRunning ? () => setIsRunning(false) : () => setIsRunning(true)}>
                {isRunning ? 'Pause' : 'Resume'}
              </button>
              <button onClick={handleEnd}>End</button>
            </>
          ) : (
            <button onClick={handleStart}>Start</button>
          )}
        </div>
      </header>
      <aside className={`sidebar${sidebarOpen ? ' sidebar--open' : ''}`}>
        <button className="sidebar_close-btn" onClick={() => setSidebarOpen(false)}>×</button>
        <nav className="sidebar_menu">
          <h2>Menu</h2>
          <SidebarButtons/>
        </nav>
      </aside>

      <main className="main-content">
        <div className="pdf-viewer-container" ref={viewerRef}>
          <CustomPdfJsViewer fileUrl={pdfUrl || '/instructions.pdf'} />
        </div>
      </main>
    </div>
  );
}

export default App;