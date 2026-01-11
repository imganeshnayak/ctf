import React, { useState, useEffect } from 'react';

const ChallengeModal = ({ stage, user, onClose, onSubmit, isSubmitting }) => {
    const [key, setKey] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [hintRevealed, setHintRevealed] = useState(false);

    // Check if hint was already revealed for this stage and user
    useEffect(() => {
        if (stage && stage.stageNumber === 9 && user) {
            const hintKey = `stage9_hint_used_${user._id}`;
            const revealed = localStorage.getItem(hintKey) === 'true';
            setHintRevealed(revealed);
        }
    }, [stage, user]);

    // Add click handler for hint button after content is rendered
    useEffect(() => {
        if (stage && stage.stageNumber === 9 && user) {
            const hintBtn = document.getElementById('revealHintBtn');
            const hintContent = document.getElementById('hintContent');

            if (hintBtn && hintContent) {
                // Set initial state based on localStorage
                if (hintRevealed) {
                    hintContent.style.display = 'block';
                    hintBtn.disabled = true;
                    hintBtn.style.opacity = '0.5';
                    hintBtn.style.cursor = 'not-allowed';
                    hintBtn.textContent = '💡 Hint Already Revealed';
                }

                // Add click handler
                const handleHintClick = () => {
                    if (!hintRevealed) {
                        // Check if user has enough points
                        if (user.totalScore < 150) {
                            alert(`❌ Insufficient points!\n\nYou need at least 150 points to reveal this hint.\nYour current score: ${user.totalScore} points\n\nComplete more challenges to earn points!`);
                            return;
                        }

                        const confirmed = window.confirm(
                            `Revealing this hint will deduct 150 points from your score.\n\nYour current score: ${user.totalScore} points\nAfter hint: ${user.totalScore - 150} points\n\nContinue?`
                        );

                        if (confirmed) {
                            setHintRevealed(true);
                            const hintKey = `stage9_hint_used_${user._id}`;
                            localStorage.setItem(hintKey, 'true');

                            hintContent.style.display = 'block';
                            hintBtn.disabled = true;
                            hintBtn.style.opacity = '0.5';
                            hintBtn.style.cursor = 'not-allowed';
                            hintBtn.textContent = '💡 Hint Revealed (-150 points)';

                            // Dispatch custom event for backend to track penalty
                            window.dispatchEvent(new CustomEvent('hintUsed', {
                                detail: { stage: stage.stageNumber, penalty: 150 }
                            }));

                            // Optional: Call API to deduct points immediately
                            // You can add this functionality later
                        }
                    }
                };

                hintBtn.addEventListener('click', handleHintClick);

                // Cleanup
                return () => {
                    hintBtn.removeEventListener('click', handleHintClick);
                };
            }
        }
    }, [stage, user, hintRevealed]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!key.trim()) {
            setFeedback({ type: 'error', message: 'Please enter a key' });
            return;
        }

        const result = await onSubmit(key);
        setFeedback(result);

        if (result.type === 'success') {
            setKey('');
            setTimeout(() => {
                onClose();
            }, 2000);
        }
    };

    if (!stage) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        Stage {stage.stageNumber}: {stage.title}
                    </h2>
                    <button className="close-button" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    <div
                        className="challenge-content"
                        dangerouslySetInnerHTML={{ __html: stage.challengeContent }}
                    />

                    {!stage.completed && (
                        <div className="key-submission">
                            <h3>🔑 Submit Your Flag</h3>
                            <p>Enter the flag you discovered to complete this stage:</p>

                            <form onSubmit={handleSubmit}>
                                <div className="key-input-group">
                                    <input
                                        type="text"
                                        value={key}
                                        onChange={(e) => setKey(e.target.value)}
                                        placeholder="Enter your flag here..."
                                        disabled={isSubmitting}
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Validating...' : 'Submit'}
                                    </button>
                                </div>
                            </form>

                            {feedback && (
                                <div className={`feedback-message feedback-${feedback.type}`}>
                                    {feedback.message}
                                </div>
                            )}
                        </div>
                    )}

                    {stage.completed && (
                        <div className="feedback-message feedback-success">
                            ✓ Stage Completed! You've already solved this challenge.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChallengeModal;
