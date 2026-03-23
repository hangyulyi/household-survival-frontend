import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const API = 'https://household-survival-production.up.railway.app';

const TIER_CONFIG = [
  { min: 80,  label: 'Platinum',  emoji: '🏆', color: '#a78bfa', desc: 'Thriving Household' },
  { min: 60,  label: 'Gold',      emoji: '🥇', color: '#fbbf24', desc: 'Stabilized' },
  { min: 35,  label: 'Silver',    emoji: '🥈', color: '#94a3b8', desc: 'Economic Survival' },
  { min: 10,  label: 'Bronze',    emoji: '🥉', color: '#b45309', desc: 'Poverty Cycle' },
  { min: -999,label: 'Crisis',    emoji: '💀', color: '#ef4444', desc: 'Household Collapsed' },
];

export const getTier = (score) => TIER_CONFIG.find(t => score >= t.min);

const Home = () => {
  const { user, token }       = useAuth();
  const navigate              = useNavigate();
  const [countries, setCountries] = useState([]);
  const [wbData, setWbData]   = useState({});

  useEffect(() => {
    axios.get(`${API}/api/countries`).then(res => {
      setCountries(res.data.countries);
      res.data.countries.forEach(c => {
        axios.get(`${API}/api/countries/${c.country_code}/worldbank`)
          .then(wb => setWbData(prev => ({ ...prev, [c.country_code]: wb.data })))
          .catch(() => {});
      });
    });
  }, []);

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <div className="sdg-pill">🎯 SDG 1 — No Poverty</div>
          <h1>Can you keep your family afloat?</h1>
          <p>
            Household Survival is a turn-based simulation game that puts you in the shoes
            of a low-income family navigating financial instability, healthcare crises,
            and the pressures of modern poverty — across 5 different countries.
          </p>
          <button className="play-btn" onClick={() => navigate('/game')}>
            Play Now →
          </button>
        </div>
      </div>

      <div className="home-section">
        <h2>About the SDG</h2>
        <div className="sdg-cards">
          <div className="sdg-card">
            <div className="sdg-icon">📉</div>
            <h3>700 Million People</h3>
            <p>Live on less than $2.15 per day — the World Bank's extreme poverty line.</p>
          </div>
          <div className="sdg-card">
            <div className="sdg-icon">🏥</div>
            <h3>Healthcare Inequality</h3>
            <p>Out-of-pocket health costs push millions deeper into poverty each year.</p>
          </div>
          <div className="sdg-card">
            <div className="sdg-icon">🎓</div>
            <h3>Education Gap</h3>
            <p>Access to education remains one of the strongest predictors of escaping poverty.</p>
          </div>
          <div className="sdg-card">
            <div className="sdg-icon">🌍</div>
            <h3>It's Systemic</h3>
            <p>Poverty is not a personal failure — it is the result of systems, policies, and chance.</p>
          </div>
        </div>
      </div>

      <div className="home-section">
        <h2>Countries in the Game</h2>
        <p className="section-sub">Starting conditions powered by real World Bank data</p>
        <div className="country-cards">
          {countries.map(c => {
            const wb = wbData[c.country_code];
            return (
              <div key={c.country_code} className="country-card">
                <div className="country-flag">{c.flag_emoji}</div>
                <h3>{c.country_name}</h3>
                <div className={`difficulty-badge diff-${c.difficulty_label.toLowerCase().replace('-', '')}`}>
                  {c.difficulty_label}
                </div>
                <p className="intro-text">{c.intro_text}</p>
                {wb && (
                  <div className="wb-stats">
                    <div className="wb-stat">
                      <span className="wb-label">GNI per capita</span>
                      <span className="wb-value">${wb.wb_gni_per_capita?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="wb-stat">
                      <span className="wb-label">Life expectancy</span>
                      <span className="wb-value">{wb.wb_life_expectancy?.toFixed(1) || 'N/A'} yrs</span>
                    </div>
                    <div className="wb-stat">
                      <span className="wb-label">Poverty rate</span>
                      <span className="wb-value">{wb.wb_poverty_rate?.toFixed(1) || 'N/A'}%</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="home-section">
        <h2>Score Tiers</h2>
        <div className="tier-list">
          {TIER_CONFIG.map(t => (
            <div key={t.label} className="tier-row" style={{ borderColor: t.color }}>
              <span className="tier-emoji">{t.emoji}</span>
              <span className="tier-label" style={{ color: t.color }}>{t.label}</span>
              <span className="tier-desc">{t.desc}</span>
              <span className="tier-range" style={{ color: t.color }}>
                {t.min > -999 ? `${t.min}+ pts` : 'Below 10'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;