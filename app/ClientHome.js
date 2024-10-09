'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import PartyRoom from '../components/PartyRoom';
import GameCarousel from '../components/GameCarousel';
import PhotoBooth from '../components/PhotoBooth';
import SurpriseCapsules from '../components/SurpriseCapsules';

export default function ClientHome() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = require('../public/script.js');
      // Initialize any functions from script.js if needed
    }
  }, []);

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/parallax.js/1.5.0/parallax.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js" strategy="beforeInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js" strategy="beforeInteractive" />

      <div id="particles-js"></div>

      <PartyRoom />
      <GameCarousel />
      <PhotoBooth />
      <SurpriseCapsules />
    </>
  );
}