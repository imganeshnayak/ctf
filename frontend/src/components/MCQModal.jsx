import { useState, useEffect, useRef } from 'react';
import { submitMcqAnswer } from '../services/api';
import './MCQModal.css';

const TOTAL_TIME = 45;

export default function MCQModal({ stage, userId, onClose }) {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState(null); // { correct, bonusPoints }
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
    const timerRef = useRef(null);

    // Countdown timer
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    if (!submitted) handleSkip();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []);

    const handleSkip = () => {
        clearInterval(timerRef.current);
        // Brief skip message then close
        setResult({ correct: false, skipped: true, bonusPoints: 0 });
        setSubmitted(true);
        setTimeout(onClose, 1800);
    };

    const handleSubmit = async () => {
        if (selectedIndex === null || submitted) return;
        clearInterval(timerRef.current);
        setSubmitted(true);

        try {
            const res = await submitMcqAnswer(stage._id, userId, selectedIndex);
            setResult({
                correct: res.correct,
                bonusPoints: res.bonusPoints,
                totalScore: res.totalScore
            });
        } catch {
            setResult({ correct: false, bonusPoints: 0, error: true });
        }
        setTimeout(onClose, 2200);
    };

    const progress = (timeLeft / TOTAL_TIME) * 100;
    const radius = 26;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress / 100);

    if (result) {
        return (
            <div className="mcq-overlay">
                <div className={`mcq-result-card ${result.correct ? 'mcq-result--correct' : 'mcq-result--wrong'}`}>
                    {result.correct ? (
                        <>
                            <div className="mcq-result-icon">🎉</div>
                            <h2 className="mcq-result-title">Correct!</h2>
                            <p className="mcq-result-bonus">+100 Bonus Points</p>
                        </>
                    ) : result.skipped ? (
                        <>
                            <div className="mcq-result-icon">⏭️</div>
                            <h2 className="mcq-result-title">Skipped</h2>
                            <p className="mcq-result-sub">No points deducted — keep going!</p>
                        </>
                    ) : (
                        <>
                            <div className="mcq-result-icon">❌</div>
                            <h2 className="mcq-result-title">Wrong Answer</h2>
                            <p className="mcq-result-sub">No points lost — better luck next time!</p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="mcq-overlay">
            <div className="mcq-card">
                {/* Timer ring */}
                <div className="mcq-timer-wrap">
                    <svg className="mcq-timer-ring" viewBox="0 0 60 60">
                        <circle cx="30" cy="30" r={radius} className="mcq-ring-bg" />
                        <circle
                            cx="30" cy="30" r={radius}
                            className={`mcq-ring-fill ${timeLeft <= 10 ? 'mcq-ring-fill--urgent' : ''}`}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                        />
                    </svg>
                    <span className={`mcq-time-num ${timeLeft <= 10 ? 'mcq-time-urgent' : ''}`}>{timeLeft}</span>
                </div>

                <div className="mcq-badge">⚡ BONUS QUESTION</div>
                <p className="mcq-stage-label">Stage {stage.stageNumber} Complete</p>
                <h2 className="mcq-question">{stage.mcq?.question}</h2>

                <div className="mcq-options">
                    {stage.mcq?.options?.map((opt, i) => (
                        <button
                            key={i}
                            className={`mcq-option ${selectedIndex === i ? 'mcq-option--selected' : ''}`}
                            onClick={() => setSelectedIndex(i)}
                        >
                            <span className="mcq-option-letter">{String.fromCharCode(65 + i)}</span>
                            {opt}
                        </button>
                    ))}
                </div>

                <div className="mcq-actions">
                    <button className="mcq-skip-btn" onClick={handleSkip}>Skip</button>
                    <button
                        className={`mcq-submit-btn ${selectedIndex !== null ? 'mcq-submit-btn--active' : ''}`}
                        onClick={handleSubmit}
                        disabled={selectedIndex === null}
                    >
                        Submit Answer
                    </button>
                </div>

                <p className="mcq-info">Correct = +100 pts · Wrong or Skip = no change</p>
            </div>
        </div>
    );
}
