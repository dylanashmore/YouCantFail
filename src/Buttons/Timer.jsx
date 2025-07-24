import React, { useState, useEffect, useRef } from 'react';

const Timer = ({ isRunning, hasEnded }) => {
  const intervalRef = useRef(null);
  const [time, setTime] = useState({ minutes: 10, seconds: 0 });

  useEffect(() => {
    // Stop and reset if ended
    if (hasEnded) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setTime({ minutes: 0, seconds: 0 });
      return;
    }

    // Stop timer if paused
    if (!isRunning) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    // ✅ Immediate tick when starting/resuming
    setTime(prev => {
      const { minutes, seconds } = prev;
      if (minutes === 0 && seconds === 0) return prev;
      if (seconds === 0) return { minutes: minutes - 1, seconds: 59 };
      return { minutes, seconds: seconds - 1 };
    });

    // ✅ Continue ticking every second
    intervalRef.current = setInterval(() => {
      setTime(prev => {
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

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isRunning, hasEnded]);

  const format = (num) => String(num).padStart(2, '0');

  return (
    <button>
      Time left: {format(time.minutes)}:{format(time.seconds)}
    </button>
  );
};

export default Timer;
