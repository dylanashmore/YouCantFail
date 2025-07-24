import React, { useState, useRef, useEffect } from 'react';
import '../style.css';

const PointCounter = () => {
  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  const [earned, setEarned] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleChange = (setter) => (e) => {
    const value = e.target.value;
    if (value === '') {
      setter('');
    } else {
      const number = parseInt(value, 10);
      if (!isNaN(number) && number >= 0) {
        setter(number);
      }
    }
  };

  const percentage =
    total > 0 && earned !== ''
      ? ((parseInt(earned) / parseInt(total)) * 100).toFixed(2)
      : '—';

  return (
    <div className="point-counter-dropdown">
      <button
        ref={buttonRef}
        className="top-bar-btn"
        onClick={() => setOpen((prev) => !prev)}
      >
        Point Counter
      </button>
      {open && (
        <div className="point-counter-popup" ref={popupRef}>
          <div className="point-counter-container">
            <div className="point-counter-input-row">
              <div className="point-counter-group">
                <div>Earned</div>
                <input
                  type="number"
                  min="0"
                  value={earned}
                  onChange={handleChange(setEarned)}
                  className="point-counter-input"
                />
              </div>
              <div className="point-counter-group">
                <div>Total</div>
                <input
                  type="number"
                  min="0"
                  value={total}
                  onChange={handleChange(setTotal)}
                  className="point-counter-input"
                />
              </div>
            </div>
            <div className="point-counter-percentage">
              {percentage}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointCounter;
