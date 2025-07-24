import React, { useState } from 'react';
import SidebarButtons from '../Buttons/sidebarButtons';
import '../style.css';

function AboutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-root">
      <div className="top-bar">
        <div className="left-section">
          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
        </div>
      </div>

      <div className="app-body">
        <aside className={`sidebar${sidebarOpen ? ' sidebar--open' : ''}`}>
          <button
            className="sidebar_close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            ×
          </button>
          <nav className="sidebar_menu">
            <h2>Menu</h2>
            <SidebarButtons />
          </nav>
        </aside>

        <main className="about-page">
          <h1>About This App</h1>
          <p>
            This website was made by fellow CS Knights for Knights to study for the foundation
            exam utilizing the past exams. You can choose to study by outlined topics
            which are timed to simulate the actual exam experience or by the Full Exam mode which takes
            you through an entire exam in 2 hours. Track your points using our point counter.
            <br /><br />
            This project takes inspiration from Zain Emmanuel Yousaf Fuentes's "passthefoundationexam" site and
            Vijay Stroup's UCF FE Practice. Special thanks to them for inspiration and some advice.
          </p>

          <section>
            <h2>Developers</h2>
            <div className="developer-cards">
              <div className="developer-card">
                <h3>Keon Phan</h3>
                <p>
                  Hi, I am a second-year undergraduate student at the University of Central Florida 
                  majoring in Computer Science BS. I am interested in computer vision alongside front 
                  and back-end development and LLM/AI training. This was my first project outside of class 
                  assignments and was a great learning experience. I hope it helps you study for the foundation exam!
                  If you would like to follow my next projects or join a team, feel free to reach out!
                </p>
                <div className="social-links">
                  <a href="https://www.linkedin.com/in/keon-phan/" target="_blank" rel="noopener noreferrer">
                    <img src="/icons/linkedin.svg" alt="LinkedIn" />
                  </a>
                  <a href="https://github.com/keonphan" target="_blank" rel="noopener noreferrer">
                    <img src="/icons/github.svg" alt="GitHub" />
                  </a>
                </div>
              </div>

              <div className="developer-card">
                <h3>Dylan Ashmore</h3>
                <p>
                  Hi, I am a second-year student at the University of Central Florida majoring in Computer Science BS.
                  I recently transferred here after completing my Associates Degree in Graphic Design at Hillsborough College.
                  I am interested in UI/UX design, as well as full stack development. Good luck on the foundation exam!
                </p>
                <div className="social-links">
                  <a href="https://www.linkedin.com/in/dylan-ashmore-0a4362316/" target="_blank" rel="noopener noreferrer">
                    <img src="/icons/linkedin.svg" alt="LinkedIn" />
                  </a>
                  <a href="https://github.com/dylanashmore" target="_blank" rel="noopener noreferrer">
                    <img src="/icons/github.svg" alt="GitHub" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              If you have any questions or want to chat with us, feel free to reach
              out directly or through{' '}
              <a
                href="https://forms.gle/iMnw56M93XHzkhsu9"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default AboutPage;
