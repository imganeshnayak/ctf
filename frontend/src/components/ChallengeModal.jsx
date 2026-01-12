import React, { useState, useEffect } from 'react';

const ChallengeModal = ({ stage, user, onClose, onSubmit, isSubmitting }) => {
    const [key, setKey] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [hintRevealed, setHintRevealed] = useState(false);

    // Check if hint was already revealed for this stage and user
    useEffect(() => {
        if (stage && user) {
            const hintKey = `stage${stage.stageNumber}_hint_used_${user._id}`;
            const revealed = localStorage.getItem(hintKey) === 'true';
            setHintRevealed(revealed);
        }
    }, [stage, user]);

    // Add click handler for hint button after content is rendered
    useEffect(() => {
        if (stage && user) {
            // Small delay to ensure DOM is ready and painted
            const timer = setTimeout(() => {
                const hintBtn = document.getElementById('revealHintBtn');
                const hintContent = document.getElementById('hintContent');

                if (hintBtn && hintContent) {
                    // Safety: Remove any legacy inline handlers that might cause errors
                    if (hintBtn.hasAttribute('onclick')) {
                        hintBtn.removeAttribute('onclick');
                    }

                    // Set initial state based on localStorage or state
                    if (hintRevealed) {
                        hintContent.style.display = 'block';
                        hintBtn.disabled = true;
                        hintBtn.style.opacity = '0.5';
                        hintBtn.style.cursor = 'not-allowed';
                        hintBtn.textContent = '💡 Hint Already Revealed';
                    } else {
                        // Ensure it's hidden if not revealed
                        hintContent.style.display = 'none';
                    }

                    // Remove existing listeners (cloning node is a clean way to wipe listeners)
                    const newHintBtn = hintBtn.cloneNode(true);
                    hintBtn.parentNode.replaceChild(newHintBtn, hintBtn);

                    // Add clean click handler to the new node
                    const handleHintClick = () => {
                        if (!hintRevealed) {
                            if (user.totalScore < 150) {
                                alert(`❌ Insufficient points!\n\nYou need at least 150 points to reveal this hint.\nYour current score: ${user.totalScore} points\n\nComplete more challenges to earn points!`);
                                return;
                            }

                            const confirmed = window.confirm(
                                `Revealing this hint will deduct 150 points from your score.\n\nYour current score: ${user.totalScore} points\nAfter hint: ${user.totalScore - 150} points\n\nContinue?`
                            );

                            if (confirmed) {
                                // Disable button immediately
                                newHintBtn.disabled = true;
                                newHintBtn.textContent = 'Processing...';

                                // Call Backend API to deduct points
                                fetch(`http://localhost:5000/api/users/${user._id}/deduct`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ points: 150, reason: `Stage ${stage.stageNumber} Hint` })
                                })
                                    .then(response => {
                                        if (!response.ok) {
                                            return response.json().then(err => { throw new Error(err.message || 'Failed to deduct points'); });
                                        }
                                        return response.json();
                                    })
                                    .then(data => {
                                        // Success
                                        setHintRevealed(true);
                                        const hintKey = `stage${stage.stageNumber}_hint_used_${user._id}`;
                                        localStorage.setItem(hintKey, 'true');

                                        hintContent.style.display = 'block';
                                        newHintBtn.style.opacity = '0.5';
                                        newHintBtn.style.cursor = 'not-allowed';
                                        newHintBtn.textContent = '💡 Hint Revealed (-150 points)';

                                        // Update global user state (dispatch event for parent components)
                                        window.dispatchEvent(new CustomEvent('hintUsed', {
                                            detail: { stage: stage.stageNumber, penalty: 150, newScore: data.data.totalScore }
                                        }));
                                    })
                                    .catch(error => {
                                        console.error('Error revealing hint:', error);
                                        alert("Error revealing hint: " + error.message);
                                        newHintBtn.disabled = false;
                                        newHintBtn.textContent = '💡 Reveal Hint (-150 points)';
                                    });
                            }
                        }
                    };

                    newHintBtn.addEventListener('click', handleHintClick);
                }
            }, 100);

            return () => clearTimeout(timer);
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
