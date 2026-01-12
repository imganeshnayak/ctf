import { useState, useEffect } from 'react';
import '../App.css';
import StageCard from '../components/StageCard';
import ChallengeModal from '../components/ChallengeModal';
import ProgressBar from '../components/ProgressBar';
import { createOrGetUser, getAllStages, validateStageKey, getTimer } from '../services/api';

function formatTimer(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function Challenges() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [stages, setStages] = useState([]);
    const [selectedStage, setSelectedStage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState({ running: false, remaining: 90 * 60 });

    // Load stages when user logs in
    useEffect(() => {
        if (user) {
            loadStages();
        }
    }, [user]);

    useEffect(() => {
        let interval;
        const fetchTimer = async () => {
            const data = await getTimer();
            setTimer(data);
        };
        fetchTimer();
        interval = setInterval(fetchTimer, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username.trim() || username.trim().length < 3) {
            alert('Username must be at least 3 characters long');
            return;
        }

        setIsLoading(true);
        try {
            const response = await createOrGetUser(username.trim());
            if (response.success) {
                setUser(response.data);
                localStorage.setItem('ctf_user', JSON.stringify(response.data));
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to login. Please make sure the backend server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadStages = async () => {
        try {
            const response = await getAllStages(user?._id);
            if (response.success) {
                setStages(response.data);
            }
        } catch (error) {
            console.error('Error loading stages:', error);
            if (error.response && error.response.status === 404) {
                alert('Session expired or user not found. Please login again.');
                handleLogout();
            }
        }
    };

    const handleStageClick = (stage) => {
        if (!stage.locked) {
            setSelectedStage(stage);
        }
    };

    const handleKeySubmit = async (submittedKey) => {
        setIsSubmitting(true);
        try {
            const response = await validateStageKey(
                selectedStage._id,
                user._id,
                submittedKey
            );

            if (response.success) {
                // Update user data
                const updatedUser = {
                    ...user,
                    currentStage: response.data.currentStage,
                    completedStages: response.data.completedStages,
                    totalScore: response.data.totalScore
                };
                setUser(updatedUser);
                localStorage.setItem('ctf_user', JSON.stringify(updatedUser));

                // Reload stages to update locked/unlocked status
                await loadStages();

                return {
                    type: 'success',
                    message: '🎉 ' + response.message
                };
            }
        } catch (error) {
            if (error.response?.data?.message) {
                return {
                    type: 'error',
                    message: '❌ ' + error.response.data.message
                };
            }
            return {
                type: 'error',
                message: '❌ An error occurred. Please try again.'
            };
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        setUser(null);
        setUsername('');
        setStages([]);
        localStorage.removeItem('ctf_user');
    };

    // Try to restore user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('ctf_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                localStorage.removeItem('ctf_user');
            }
        }
    }, []);

    const completedStages = user?.completedStages?.length || 0;
    const totalStages = stages.length;

    return (
        <div className="app">
            <div className="container">


                <div className="timer-display">
                    {/* Inline Timer Display Component */}
                    <div className="timer-display" style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#0077ff', letterSpacing: '2px', margin: '1.5rem 0' }}>
                        ⏰ {formatTimer(timer.remaining)} {timer.running ? '(Running)' : '(Stopped)'}
                    </div>
                </div>

                {!user ? (
                    <div className="login-section fade-in">
                        <h2 className="text-center mb-3">Enter the Arena</h2>
                        <p className="text-center mb-3">
                            Enter your username to start your CTF journey
                        </p>
                        <form onSubmit={handleLogin} className="login-form">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username..."
                                minLength={3}
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' : 'Start Challenge'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <>
                        <div className="progress-section fade-in">
                            <div className="user-info">
                                <div>
                                    <div className="user-name">👤 {user.username}</div>
                                    <div className="user-stats">
                                        <div className="stat">
                                            <span>Current Stage:</span>
                                            <span className="stat-value">{user.currentStage}</span>
                                        </div>
                                        <div className="stat">
                                            <span>Total Score:</span>
                                            <span className="stat-value">{user.totalScore}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleLogout} className="btn-secondary">
                                    Logout
                                </button>
                            </div>
                            <ProgressBar completed={completedStages} total={totalStages} />
                        </div>

                        <div className="stages-grid">
                            {stages.map((stage, index) => (
                                <StageCard
                                    key={stage._id}
                                    stage={stage}
                                    onClick={handleStageClick}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                />
                            ))}
                        </div>

                        {stages.length === 0 && (
                            <div className="text-center">
                                <p>Loading challenges...</p>
                            </div>
                        )}
                    </>
                )}

                {selectedStage && (
                    <ChallengeModal
                        stage={selectedStage}
                        user={user}
                        onClose={() => setSelectedStage(null)}
                        onSubmit={handleKeySubmit}
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>
        </div>
    );
}

export default Challenges;
