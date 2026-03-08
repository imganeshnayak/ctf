import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard } from '../services/api';
import './LeaderboardPage.css';

/* ── helpers ─────────────────────────────────────────── */
function hashStr(s) {
    let h = 0;
    for (let c of s) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
    return Math.abs(h);
}
const GRAD = [
    ['#00f5d4', '#7c3aed'], ['#f72585', '#4361ee'], ['#4cc9f0', '#f72585'],
    ['#7209b7', '#00f5d4'], ['#f59e0b', '#7c3aed'], ['#10b981', '#4361ee'],
];
function playerGrad(username) { return GRAD[hashStr(username) % GRAD.length]; }

function Avatar({ username, size = 48 }) {
    const [c1, c2] = playerGrad(username);
    const initials = username.slice(0, 2).toUpperCase();
    return (
        <svg width={size} height={size} viewBox="0 0 48 48">
            <defs>
                <linearGradient id={`av-${username}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={c1} />
                    <stop offset="100%" stopColor={c2} />
                </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="23" fill={`url(#av-${username})`} opacity="0.25" />
            <circle cx="24" cy="24" r="23" fill="none" stroke={c1} strokeWidth="1.5" />
            <text x="24" y="29" textAnchor="middle" fontSize="14" fontWeight="800"
                fontFamily="monospace" fill={c1}>{initials}</text>
        </svg>
    );
}


/* ── Main Page ───────────────────────────────────────── */
export default function LeaderboardPage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('ctf_user') || 'null');
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQ, setSearchQ] = useState('');
    const [countdown, setCountdown] = useState(30);
    const myRowRef = useRef(null);

    useEffect(() => { if (!user) navigate('/challenges'); }, []);

    useEffect(() => {
        const fetchLB = (isInitial = false) => {
            if (isInitial) setLoading(true);
            getLeaderboard()
                .then(r => { if (r.success) setLeaderboard(r.data); })
                .catch(() => setError('Failed to load leaderboard'))
                .finally(() => setLoading(false));
        };

        fetchLB(true);

        const tick = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    fetchLB();
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(tick);
    }, []);

    // scroll my row into view only on initial load
    const scrolledRef = useRef(false);
    useEffect(() => {
        if (!loading && leaderboard.length > 0 && !scrolledRef.current) {
            if (myRowRef.current) {
                myRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                scrolledRef.current = true;
            }
        }
    }, [leaderboard, loading]);

    if (!user) return null;

    const filtered = (searchQ.trim()
        ? leaderboard.filter(p => p.username.toLowerCase().includes(searchQ.toLowerCase()))
        : leaderboard);

    const formatDate = d => {
        if (!d) return '—';
        const dt = new Date(d);
        return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="lb-root">
            {/* Background effects */}
            <div className="lb-bg" aria-hidden="true" />

            {/* ── HEADER ──────────────────────────────────────── */}
            <header className="lb-header">
                <div className="lb-header-left">
                    <button className="lb-back-btn" onClick={() => navigate('/lobby')}>
                        ← Back to Lobby
                    </button>
                </div>
                <div className="lb-header-center">
                    <div className="lb-eyebrow">REAL-TIME RANKINGS</div>
                    <h1 className="lb-title">🏆 Leaderboard</h1>
                    <p className="lb-subtitle">Hackers ranked by completed stages and score</p>
                </div>
                <div className="lb-header-right">
                    <div className="lb-stat-chip">
                        <span className="lb-stat-num">{leaderboard.length}</span>
                        <span className="lb-stat-label">Total Players</span>
                    </div>
                    <div className="lb-stat-chip lb-stat-chip--timer" style={{ '--tp': `${(countdown / 30) * 100}%` }}>
                        <span className="lb-stat-num">{countdown}s</span>
                        <span className="lb-stat-label">Refreshes in</span>
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="lb-loading">
                    <div className="lb-spinner" />
                    <p>Loading rankings...</p>
                </div>
            ) : error ? (
                <div className="lb-error">{error}</div>
            ) : (
                <div className="lb-body">

                    {/* ── FULL TABLE ────────────────────────────────── */}
                    <section className="lb-table-section">
                        <div className="lb-table-header">
                            <div className="lb-table-title">Participants Rankings</div>
                            <input
                                className="lb-search"
                                placeholder="🔍  Search player..."
                                value={searchQ}
                                onChange={e => setSearchQ(e.target.value)}
                            />
                        </div>

                        <div className="lb-table-wrap">
                            <table className="lb-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: 80 }}>Rank</th>
                                        <th>Player</th>
                                        <th>Stages</th>
                                        <th>Score</th>
                                        <th>Progress</th>
                                        <th>Last Active</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((player) => {
                                        const isMe = player.username === user?.username;
                                        const [c1] = playerGrad(player.username);
                                        const isRank1 = player.rank === 1;
                                        const isRank2 = player.rank === 2;
                                        const rankClass = isRank1 ? 'lb-row--rank1' : isRank2 ? 'lb-row--rank2' : '';

                                        return (
                                            <tr key={player.username}
                                                className={`lb-row ${rankClass} ${isMe ? 'lb-row--me' : ''}`}
                                                ref={isMe ? myRowRef : null}
                                                style={{ '--rc': c1 }}>
                                                <td className="lb-rank">
                                                    {isRank1 ? <span className="lb-medal">🥇</span> :
                                                        isRank2 ? <span className="lb-medal">🥈</span> :
                                                            <span className="lb-rank-num">#{player.rank}</span>}
                                                </td>
                                                <td className="lb-player">
                                                    <Avatar username={player.username} size={36} />
                                                    <span className="lb-uname">{player.username}</span>
                                                    {isMe && <span className="lb-you">YOU</span>}
                                                </td>
                                                <td className="lb-cell">{player.completedStages}</td>
                                                <td className="lb-score">{player.totalScore.toLocaleString()}</td>
                                                <td className="lb-progress-cell">
                                                    <div className="lb-pbar-bg">
                                                        <div className="lb-pbar-fill"
                                                            style={{
                                                                width: `${Math.min((player.completedStages / 15) * 100, 100)}%`,
                                                                background: `linear-gradient(90deg, ${c1}, ${isRank1 ? '#ffd700' : isRank2 ? '#c0c0c0' : '#7c3aed'})`
                                                            }} />
                                                    </div>
                                                    <span className="lb-pct">{Math.round((player.completedStages / 15) * 100)}%</span>
                                                </td>
                                                <td className="lb-time">{formatDate(player.lastCompletionTime)}</td>
                                            </tr>
                                        );
                                    })}

                                    {leaderboard.length === 0 && (
                                        <tr><td colSpan="6" className="lb-empty">
                                            No players yet — be the first to complete a challenge!
                                        </td></tr>
                                    )}
                                    {searchQ && filtered.length === 0 && (
                                        <tr><td colSpan="6" className="lb-empty">No player matching "{searchQ}"</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <p className="lb-footer">{leaderboard.length} registered hackers · Rankings update in real-time</p>
                    </section>
                </div>
            )}
        </div>
    );
}

