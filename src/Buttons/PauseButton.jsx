import React from 'react';

const PauseButton = ({ onStop }) => {
  return (
    <button onClick={onStop}>
      Pause
    </button>
  );
};

export default PauseButton;
