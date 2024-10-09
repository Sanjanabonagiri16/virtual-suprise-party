import React from 'react';

export default function PartyRoom() {
  return (
    <div className="parallax-container">
      <div className="parallax-layer" data-depth="0.2">
        <img src="/background-image.jpg" alt="Background" className="parallax-bg" />
      </div>
      <div className="parallax-layer" data-depth="0.5">
        <div className="auth-buttons">
          <button className="auth-button login" aria-label="Login">
            <i className="fas fa-key"></i> Login
          </button>
          <button className="auth-button signup" aria-label="Sign Up">
            <i className="fas fa-user-plus"></i> Sign Up
          </button>
        </div>
      </div>
      <div className="parallax-layer" data-depth="0.8">
        <section className="introduction">
          <h1 className="welcome-headline">Welcome to Your Virtual Surprise Party Room</h1>
          <p className="welcome-description">Create unforgettable moments with friends and family, no matter the distance.</p>
          
          <div className="party-buttons">
            <button className="party-button create-party" aria-label="Create a Party">
              <i className="fas fa-plus-circle"></i> Create a Party
            </button>
            <button className="party-button join-party" aria-label="Join a Party">
              <i className="fas fa-sign-in-alt"></i> Join a Party
            </button>
            <button className="party-button start-game" aria-label="Start Game">
              <i className="fas fa-gamepad"></i> Start Game
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}