import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { getTier } from './Home';
import './Settings.css';

const API = 'https://household-survival-production.up.railway.app';

const COUNTRIES = {
  us: { name: 'United States', emoji: '🇺🇸' },
  in: { name: 'India',         emoji: '🇮🇳' },
  ke: { name: 'Kenya',         emoji: '🇰🇪' },
  se: { name: 'Sweden',        emoji: '🇸🇪' },
  br: { name: 'Brazil',        emoji: '🇧🇷' },
};

const Settings = () => {
  const { user, token, login }      = useAuth();
  const [username, setUsername]     = useState(user?.username || '');
  const [email, setEmail]           = useState(user?.email || '');
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [success, setSuccess]       = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [standing, setStanding]     = useState(null);
  const [loadingStanding, setLoadingStanding] = useState(false);

  const country = COUNTRIES[user?.country_code];

  const loadStanding = () => {
    setLoadingStanding(true);
    axios.get(`${API}/api/progress/leaderboard`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const rank = res.data.leaderboard.findIndex(e => e.email === user.email);
      const me   = res.data.leaderboard.find(e => e.email === user.email);
      setStanding({ rank: rank === -1 ? null : rank + 1, entry: me });
      setLoadingStanding(false);
    }).catch(() => setLoadingStanding(false));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password && password !== confirm) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      const body = { username, email };
      if (password) body.password = password;

      const res = await axios.patch(`${API}/api/auth/update`, body, {
        headers: { Authorization: `Bearer ${token}` }
      });

      login(res.data.user, token);
      setSuccess('Profile updated successfully.');
      setPassword('');
      setConfirm('');
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your profile and view your standing</p>
      </div>

      <div className="settings-grid">
        <div className="settings-left">
          <div className="settings-card">
            <h2>Profile</h2>
            <div className="profile-meta">
              <div className="profile-avatar">
                {(user?.username || user?.email || '?')[0].toUpperCase()}
              </div>
              <div>
                <div className="profile-name">{user?.username || 'No username'}</div>
                <div className="profile-email">{user?.email}</div>
                {country && (
                  <div className="profile-country">
                    {country.emoji} {country.name}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="settings-card">
            <h2>Your Standing</h2>
            {!standing ? (
              <button className="check-standing-btn" onClick={loadStanding} disabled={loadingStanding}>
                {loadingStanding ? 'Loading...' : 'Check My Standing'}
              </button>
            ) : standing.entry ? (
              <div className="standing-result">
                <div className="standing-rank">#{standing.rank}</div>
                <div className="standing-score">
                  {standing.entry.total_score} pts
                </div>
                {(() => {
                  const tier = getTier(standing.entry.total_score);
                  return (
                    <div className="standing-tier" style={{ color: tier?.color }}>
                      {tier?.emoji} {tier?.label} — {tier?.desc}
                    </div>
                  );
                })()}
              </div>
            ) : (
              <p className="no-standing">You haven't completed a game yet. Play to get on the board!</p>
            )}
          </div>
        </div>

        <div className="settings-right">
          <div className="settings-card">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Your display name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat new password"
                />
              </div>

              {error   && <div className="settings-error">{error}</div>}
              {success && <div className="settings-success">{success}</div>}

              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;