import React, { useEffect } from 'react';

export default function GameCarousel() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('../public/games.js');
    }
  }, []);

  return (
    <div id="gamesModal" className="modal">
      <div className="modal-content">
        <span className="close">&times;</span>
        <h2>Party Games</h2>
        <div id="gameSelectionCarousel" className="game-carousel">
          <div className="carousel-container">
            <div className="carousel-track">
              {/* Game cards will be dynamically inserted here by games.js */}
            </div>
          </div>
          <button className="carousel-button prev">&lt;</button>
          <button className="carousel-button next">&gt;</button>
        </div>
        <div id="gameArea" style={{display: 'none'}}>
          <h3 id="gameTitle"></h3>
          <div id="gameContent"></div>
          <div id="gameControls"></div>
        </div>
      </div>
    </div>
  );
}