import React, { useState, useRef, useEffect } from 'react';

const HistoryButton = ({ history = [], onSelect }) => {
  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);

  // Split history into questions and solutions
  const questions = history.filter((url) => url.includes('Questions'));
  const solutions = history.filter((url) => url.includes('Solutions'));

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="history-popup-wrapper" ref={popupRef}>
      <button className="history-btn" onClick={() => setOpen((prev) => !prev)}>History</button>
      {open && (
        <div className="history-popup">
          <div className="history-popup-section">
            <h4>Questions</h4>
            {questions.length === 0 ? (
              <p>No questions yet.</p>
            ) : (
              <ul className="history-list">
                {questions.map((url) => (
                  <li key={url} className="history-list-item">
                    <button
                      className="history-list-btn"
                      onClick={() => {
                        setOpen(false);
                        onSelect(url);
                      }}
                    >
                      {url.split('/').pop()}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="history-popup-section">
            <h4>Solutions</h4>
            {solutions.length === 0 ? (
              <p>No solutions yet.</p>
            ) : (
              <ul className="history-list">
                {solutions.map((url) => (
                  <li key={url} className="history-list-item">
                    <button
                      className="history-list-btn"
                      onClick={() => {
                        setOpen(false);
                        onSelect(url);
                      }}
                    >
                      {url.split('/').pop()}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryButton;