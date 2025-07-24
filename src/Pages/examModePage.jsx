import React, { useState, useEffect, useRef } from 'react';
import PointCounter from '../Buttons/pointCounter';
import SidebarButtons from '../Buttons/sidebarButtons';
import CustomPdfJsViewer from '../CustomPdfJsViewer';
import { getSolutionPdfForQuestion, fullExams_Questions } from '../Handlers/pdfHandler';
import '../style.css';

function ExamModePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [hasEnded, setHasEnded] = useState(true);
  const [time, setTime] = useState({ minutes: 120, seconds: 0 });
  const [pdfUrl, setPdfUrl] = useState(null);
  const [userAttemptUrl, setUserAttemptUrl] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [solutionUrl, setSolutionUrl] = useState(null);
  const intervalRef = useRef(null);
  const viewerRef = useRef(null);

  const getFullExamPdfs = () => {
    return fullExams_Questions.fullExam_Questions.map((filename) => ({
      name: filename.replace('/fullExams/', ''),
      url: filename,
    }));
  };

  const startExam = (url) => {
    setPdfUrl(url);
    setUserAttemptUrl(null);
    setShowSolution(false);
    setTime({ minutes: 120, seconds: 0 });
    setHasEnded(false);
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);
  const handleResume = () => setIsRunning(true);

  const handleEnd = () => {
    if (pdfUrl) {
      setUserAttemptUrl(pdfUrl);
      const solutionPdf = getSolutionPdfForFullExam(pdfUrl);
      if (solutionPdf) {
        setSolutionUrl(solutionPdf);
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
          handleEnd();
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
      <div className="top-bar">
        <div className="left-section">
          <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(true)}>☰</button>
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
          ) : null}
        </div>
      </div>

      <aside className={`sidebar${sidebarOpen ? ' sidebar--open' : ''}`}>
        <button className="sidebar_close-btn" onClick={() => setSidebarOpen(false)}>×</button>
        <nav className="sidebar_menu">
          <h2>Menu</h2>
          <SidebarButtons />
        </nav>
      </aside>

      <div className="pdf-viewer-container" ref={viewerRef}>
        {pdfUrl ? (
          <>
            <CustomPdfJsViewer fileUrl={userAttemptUrl || pdfUrl} />


            {hasEnded && userAttemptUrl && (
              <div style={{ position: 'absolute', top: '20px', right: '200px', zIndex: 10 }}>
                <button
                  className="compare-btn"
                  onClick={() => setShowSolution((s) => !s)}
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
                  transition: 'opacity 0.2s',
                }}
              >
                <CustomPdfJsViewer fileUrl={solutionUrl || ''} />

              </div>
            )}
          </>
        ) : (
          <div className="pdf-list-page" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Available Full Exams</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                justifyContent: 'center',
                maxWidth: '900px',
                margin: '0 auto',
              }}
            >
              {getFullExamPdfs().map(({ name, url }) => (
                <button
                  key={url}
                  style={{
                    background: '#333',
                    color: '#fff',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onClick={() => startExam(url)}
                  onMouseOver={(e) => e.target.style.background = '#555'}
                  onMouseOut={(e) => e.target.style.background = '#333'}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamModePage;