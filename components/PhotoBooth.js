import React, { useEffect, useRef } from 'react';

export default function PhotoBooth() {
  const photoBoothRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const PhotoBoothClass = require('../public/photoBooth.js').default;
      new PhotoBoothClass(photoBoothRef.current);
    }
  }, []);

  return (
    <div id="photoBooth" className="photo-booth" ref={photoBoothRef}>
      <div className="camera-preview">
        <video id="cameraFeed" autoPlay playsInline></video>
        <div id="backgroundLayer" className="background-layer"></div>
        <canvas id="effectsCanvas" className="effects-canvas"></canvas>
      </div>
      <div className="controls">
        <button id="captureButton" className="capture-button">
          <i className="fas fa-camera"></i>
        </button>
      </div>
      <div id="backgroundCarousel" className="background-carousel">
        {/* Background options will be dynamically added here */}
      </div>
      <div className="customization-panel">
        <button id="filtersButton" className="panel-button">Filters</button>
        <button id="stickersButton" className="panel-button">Stickers</button>
        <button id="overlaysButton" className="panel-button">Overlays</button>
      </div>
      <div id="photoPreview" className="photo-preview">
        <img id="capturedPhoto" src="" alt="Captured Photo" style={{display: 'none'}} />
      </div>
    </div>
  );
}