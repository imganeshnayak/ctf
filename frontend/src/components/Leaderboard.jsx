import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getLeaderboard } from '../services/api';
import { getTimer, startTimer, stopTimer } from '../services/api';
import '../App.css';

function Leaderboard({ currentUser }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timer, setTimer] = useState({ running: false, remaining: 90 * 60 });
    const [timerLoading, setTimerLoading] = useState(false);

    useEffect(() => {
        loadLeaderboard();
        fetchTimer();
        const interval = setInterval(fetchTimer, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await getLeaderboard();
            if (response.success) {
                setLeaderboard(response.data);
            }
        } catch (err) {
            console.error('Error loading leaderboard:', err);
            setError('Failed to load leaderboard');
        } finally {
            setLoading(false);
        }
    };

    const fetchTimer = async () => {
        try {
            const data = await getTimer();
            setTimer(data);
        } catch (err) {
            console.error('Error fetching timer:', err);
        }
    };

    const handleStart = async () => {
        setTimerLoading(true);
        try {
            await startTimer();
            // Optionally, you can refetch the timer here if needed
        } catch (err) {
            console.error('Error starting timer:', err);
        } finally {
            setTimerLoading(false);
        }
    };

    const handleStop = async () => {
        setTimerLoading(true);
        try {
            await stopTimer();
            // Optionally, you can refetch the timer here if needed
        } catch (err) {
            console.error('Error stopping timer:', err);
        } finally {
            setTimerLoading(false);
        }
    };

    const getMedalIcon = (rank) => {
        switch (rank) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return null;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTimer = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (loading) {
        return (
        
                <div className="loading-spinner">Loading leaderboard...</div>
        );
    }

    if (error) {
        return (
            <div className="leaderboard-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="leaderboard-container fade-in">
            <div className="leaderboard-header">
                <h2>🏆 Leaderboard</h2>
                <p className="leaderboard-subtitle">
                    Rankings based on completed stages and submission time
                </p>
            </div>

            <div className="timer-controls" style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
                <div className="timer-display" style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#0077ff', letterSpacing: '2px' }}>
                    ⏰ {formatTimer(timer.remaining)} {timer.running ? '(Running)' : '(Stopped)'}
                </div>
                <button className="btn-primary" onClick={handleStart} disabled={timerLoading}>
                    Start/Reset 90:00
                </button>
                <button className="btn-secondary" onClick={handleStop} disabled={timerLoading}>
                    Stop
                </button>
            </div>

            <div className="leaderboard-table-wrapper">
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Completed</th>
                            <th>Score</th>
                            <th>Last Activity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-data">
                                    No players yet. Be the first to complete a challenge!
                                </td>
                            </tr>
                        ) : (
                            leaderboard.map((player) => {
                                const isCurrentUser = currentUser && player.username === currentUser.username;
                                return (
                                    <tr
                                        key={player.username}
                                        className={isCurrentUser ? 'current-user' : ''}
                                    >
                                        <td className="rank-cell">
                                            <span className="rank-number">
                                                {getMedalIcon(player.rank) || `#${player.rank}`}
                                            </span>
                                        </td>
                                        <td className="username-cell">
                                            {player.username}
                                            {isCurrentUser && <span className="you-badge">You</span>}
                                        </td>
                                        <td className="stages-cell">
                                            <span className="stages-badge">
                                                {player.completedStages} stages
                                            </span>
                                        </td>
                                        <td className="score-cell">
                                            <span className="score-value">{player.totalScore}</span>
                                        </td>
                                        <td className="time-cell">
                                            {formatDate(player.lastCompletionTime)}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {leaderboard.length > 0 && (
                <div className="leaderboard-footer">
                    <p>Total Players: {leaderboard.length}</p>
                </div>
            )}
        </div>
    );
}

Leaderboard.propTypes = {
    currentUser: PropTypes.shape({
        username: PropTypes.string,
        _id: PropTypes.string
    })
};

export default Leaderboard;
