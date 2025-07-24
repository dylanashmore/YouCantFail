import React from 'react';
import { Link } from 'react-router-dom';

const SidebarButtons = () => (
  <ul>
    <li>
      <Link className="sidebar-link" to="/">Home</Link>
    </li>
    <li>
      <Link className="sidebar-link" to="/exam-mode">Exam Mode</Link>
    </li>
    <li>
      <a className="sidebar-link" href="https://forms.gle/ZQjHnJGuNH4ST2mj8" target="_blank" rel="noopener noreferrer">Contact</a>
    </li>
    <li>
      <Link className="sidebar-link" to="/about">About</Link>
    </li>
  </ul>
);

export default SidebarButtons;