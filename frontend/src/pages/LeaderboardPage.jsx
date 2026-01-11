import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard';
import '../App.css';

function LeaderboardPage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('ctf_user') || 'null');

    useEffect(() => {
        // Redirect to home if not logged in
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    return (
        <div className="app">
            <div className="container">
                <header className="header">
                    <h1 className="header-title">🏆 Leaderboard</h1>
                    <p className="header-subtitle">
                        Top performers ranked by completed stages and speed
                    </p>
                </header>

                <div className="leaderboard-nav">
                    <Link to="/" className="btn-secondary">
                        ← Back to Challenges
                    </Link>
                </div>

                <Leaderboard currentUser={user} />
            </div>
        </div>
    );
}

export default LeaderboardPage;
