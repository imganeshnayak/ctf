import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './AdminPage.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://ctf-zubh.onrender.com';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('ctf_admin') === '1');
  const [authError, setAuthError] = useState('');
  const [ctfStarted, setCtfStarted] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [actionMsg, setActionMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);

  // Connect to socket after auth
  useEffect(() => {
    if (!authed) return;
    const socket = io(API_BASE, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;
    socket.on('lobby-update', (snapshot) => {
      setCtfStarted(snapshot.ctfStarted);
      setParticipants(snapshot.users || []);
    });
    // fetch initial
    fetch(`${API_BASE}/api/lobby/status`)
      .then(r => r.json())
      .then(({ data }) => {
        if (data) {
          setCtfStarted(data.ctfStarted);
          setParticipants(data.users || []);
        }
      })
      .catch(() => { });
    return () => socket.disconnect();
  }, [authed]);

  const handleAuth = (e) => {
    e.preventDefault();
    if (!password.trim()) { setAuthError('Enter password'); return; }
    // Optimistically mark as authed; start/stop calls will verify server-side
    setAuthed(true);
    sessionStorage.setItem('ctf_admin', '1');
    setAuthError('');
  };

  const sendAction = async (action) => {
    setLoading(true); setActionMsg('');
    try {
      const res = await fetch(`${API_BASE}/api/admin/${action}-ctf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        if (res.status === 401) {
          setAuthed(false); sessionStorage.removeItem('ctf_admin');
          setAuthError('Wrong password. Please re-authenticate.');
        }
        setActionMsg(`❌ ${data.message || 'Request failed'}`);
      } else {
        setActionMsg(`✅ ${data.message}`);
        setCtfStarted(action === 'start');
      }
    } catch {
      setActionMsg('❌ Could not reach server');
    } finally {
      setLoading(false);
    }
  };

  if (!authed) {
    return (
      <div className="admin-root">
        <div className="admin-login glass">
          <div className="admin-login__icon">⚙️</div>
          <h1 className="admin-login__title">Admin Panel</h1>
          <p className="admin-login__sub">CTF Control Centre — restricted access</p>
          <form onSubmit={handleAuth} className="admin-login__form">
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={e => { setPassword(e.target.value); setAuthError(''); }}
              className="admin-input"
              autoFocus
            />
            {authError && <div className="admin-error">{authError}</div>}
            <button type="submit" className="admin-btn-primary">Authenticate</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <div className="admin-layout">
        {/* Header */}
        <div className="admin-header glass">
          <div className="admin-header__left">
            <span className="admin-header__icon">⚙️</span>
            <div>
              <div className="admin-header__title">CTF Admin Panel</div>
              <div className="admin-header__sub">Real-time competition control</div>
            </div>
          </div>
          <div className="admin-header__right">
            <div className={`admin-ctf-badge ${ctfStarted ? 'active' : 'idle'}`}>
              {ctfStarted ? '🔥 CTF LIVE' : '⏸ CTF STANDBY'}
            </div>
            <button
              className="admin-btn-ghost"
              onClick={() => { setAuthed(false); sessionStorage.removeItem('ctf_admin'); }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        <div className="admin-body">
          {/* Control panel */}
          <div className="admin-control glass">
            <div className="admin-control__title">🎮 CTF Controls</div>
            <div className="admin-control__desc">
              Use these controls to open and close the Challenge Arena for all participants.
              When you press <strong>Start CTF</strong>, every user in the lobby will receive
              a 5-second countdown and be redirected automatically.
            </div>

            <div className="admin-control__btns">
              <button
                className={`admin-big-btn start ${ctfStarted ? 'disabled' : ''}`}
                onClick={() => !ctfStarted && sendAction('start')}
                disabled={loading || ctfStarted}
              >
                {loading ? '⏳ Processing...' : ctfStarted ? '✅ CTF Running' : '🚀 Start CTF'}
              </button>
              <button
                className={`admin-big-btn stop ${!ctfStarted ? 'disabled' : ''}`}
                onClick={() => ctfStarted && sendAction('stop')}
                disabled={loading || !ctfStarted}
              >
                {loading ? '⏳ Processing...' : !ctfStarted ? '⏸ CTF Inactive' : '🛑 Stop CTF'}
              </button>
            </div>

            {actionMsg && (
              <div className={`admin-action-msg ${actionMsg.startsWith('✅') ? 'success' : 'error'}`}>
                {actionMsg}
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="admin-stats-row">
            <div className="admin-stat-card glass">
              <div className="asc-num">{participants.length}</div>
              <div className="asc-label">In Lobby</div>
              <div className="asc-icon">👥</div>
            </div>
            <div className="admin-stat-card glass">
              <div className="asc-num" style={{ color: ctfStarted ? 'var(--color-success)' : 'var(--color-warning)' }}>
                {ctfStarted ? 'LIVE' : 'IDLE'}
              </div>
              <div className="asc-label">CTF Status</div>
              <div className="asc-icon">{ctfStarted ? '🔥' : '⏳'}</div>
            </div>
          </div>

          {/* Participant list */}
          <div className="admin-plist glass">
            <div className="admin-plist__header">
              👥 Live Participants
              <span className="admin-plist__count">{participants.length}</span>
            </div>
            {participants.length === 0 ? (
              <div className="admin-plist__empty">No participants in lobby yet</div>
            ) : (
              <div className="admin-plist__grid">
                {participants.map((p, i) => (
                  <div key={i} className="admin-plist__item">
                    <span className="admin-plist__dot" />
                    <span className="admin-plist__name">{p.username}</span>
                    <span className="admin-plist__joined">
                      {new Date(p.joinedAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
