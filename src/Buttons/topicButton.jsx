import React, { useState, useRef, useEffect } from 'react';
import { TOPIC_PDFS } from '../Handlers/pdfHandler';


const TOPICS = Array.from(
  new Set(
    Object.keys(TOPIC_PDFS).map((key) => key.split('/')[1])
  )
).sort();

  const TopicButton = ({ onPdfSelect, selectedTopics, setSelectedTopics }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const handleDone = () => {
    setOpen(false);
  };

  return (
    <div ref={buttonRef} className="topic-dropdown-wrapper">
      <button onClick={() => setOpen((o) => !o)}>
        Topics <span className="dropdown-icon">▼</span>
      </button>
      {open && (
        <div className="dropdown-content">
          <ul className="dropdown-list">
            {TOPICS.map((topic) => (
              <li
                key={topic}
                className={`dropdown-list-item${selectedTopics.includes(topic) ? ' selected' : ''}`}
                onClick={() => toggleTopic(topic)}
              >
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic)}
                  readOnly
                  className="dropdown-checkbox"
                />
                {topic}
              </li>
            ))}
          </ul>
          <button
            onClick={handleDone}
            className="dropdown-done-btn"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default TopicButton;