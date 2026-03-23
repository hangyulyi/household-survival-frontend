import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import './Game.css';

const Game = () => {
  const { token } = useAuth();
  const iframeRef = useRef(null);

  // Once Unity WebGL build is embedded, pass the token into it
  useEffect(() => {
    const handleUnityLoaded = () => {
      if (window.unityInstance && token) {
        window.unityInstance.SendMessage('APIClient', 'SetToken', token);
      }
    };
    window.addEventListener('unityLoaded', handleUnityLoaded);
    return () => window.removeEventListener('unityLoaded', handleUnityLoaded);
  }, [token]);

  return (
    <div className="game-page">
      <div className="game-header">
        <h1>Household Survival</h1>
        <p>Navigate financial instability across 7 life phases. Every decision matters.</p>
      </div>

      <div className="game-container">
        {/* 
          When Hangyul sends the WebGL build:
          1. Drop the Build folder into public/
          2. Replace the placeholder below with:
          <iframe
            ref={iframeRef}
            src="/Build/index.html"
            className="game-frame"
            title="Household Survival Game"
            allowFullScreen
          />
        */}
        <div className="game-placeholder">
          <div className="placeholder-content">
            <div className="game-icon">🎮</div>
            <h2>Game Loading Area</h2>
            <p>The Unity WebGL build will be embedded here.</p>
            <p className="placeholder-sub">
              Waiting for WebGL build from Hangyul.
            </p>
            <div className="build-instructions">
              <p>When the build is ready:</p>
              <code>1. Copy Build/ folder into public/</code>
              <code>2. Uncomment the iframe in Game.js</code>
              <code>3. Redeploy</code>
            </div>
          </div>
        </div>
      </div>

      <div className="game-phases">
        <h3>Game Phases</h3>
        <div className="phase-list">
          {[
            { n: 1, title: 'Financial Stability',    icon: '💰' },
            { n: 2, title: 'Income Shock & Side Job', icon: '💼' },
            { n: 3, title: 'Health Crisis',           icon: '🏥' },
            { n: 4, title: 'Family Strain',           icon: '👨‍👩‍👧' },
            { n: 5, title: 'Long-Term Investment',    icon: '📚' },
            { n: 6, title: 'Reflection Checkpoint',   icon: '📊' },
            { n: 7, title: 'Final Outcome',           icon: '🏁' },
          ].map(p => (
            <div key={p.n} className="phase-item">
              <span className="phase-icon">{p.icon}</span>
              <span className="phase-num">Phase {p.n}</span>
              <span className="phase-title">{p.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;