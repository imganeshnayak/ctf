import React, { useState, useEffect } from 'react';
import { unlockHint } from '../services/api';

const ChallengeModal = ({ stage, user, onClose, onSubmit, isSubmitting }) => {
    const [key, setKey] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [hintRevealed, setHintRevealed] = useState(stage?.hintUnlocked || false);

    // Sync state with stage prop
    useEffect(() => {
        if (stage) {
            setHintRevealed(stage.hintUnlocked);
        }
    }, [stage]);
    // Handle hint reveal request
    const handleHintReveal = async () => {
        if (!hintRevealed) {
            const penalty = Math.round(stage.points * 0.25);
            const confirmed = window.confirm(
                `Revealing this hint will deduct 25% of this stage's points upon completion.\n\n` +
                `Stage Points: ${stage.points}\n` +
                `Potential Deduction: ${penalty} points\n\n` +
                `Would you like to proceed?`
            );

            if (confirmed) {
                try {
                    await unlockHint(stage._id, user._id);
                    setHintRevealed(true);
                } catch (error) {
                    console.error('Error revealing hint:', error);
                    alert("Error revealing hint: " + (error.response?.data?.message || error.message));
                }
            }
        }
    };

    // Initialize drag-and-drop for stages that use code fragments
    useEffect(() => {
        if (!stage) return;

        const timer = setTimeout(() => {
            const fragments = document.querySelectorAll('.code-fragment[draggable="true"]');
            const dropZones = document.querySelectorAll('.drop-zone');

            if (fragments.length === 0 || dropZones.length === 0) return;

            // --- Drag start ---
            fragments.forEach(frag => {
                frag.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', frag.outerHTML);
                    e.dataTransfer.setData('fragment-type', frag.dataset.type);
                    frag.style.opacity = '0.4';
                    // store reference so we can remove it on successful drop
                    window.__draggingFragment = frag;
                });
                frag.addEventListener('dragend', () => {
                    frag.style.opacity = '1';
                    window.__draggingFragment = null;
                });
            });

            // --- Drop zones ---
            dropZones.forEach(zone => {
                zone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    const fragType = e.dataTransfer.types.includes('fragment-type') ? true : false;
                    if (fragType) {
                        zone.style.borderColor = '#00ff88';
                        zone.style.background = 'rgba(0,255,136,0.08)';
                    }
                });
                zone.addEventListener('dragleave', () => {
                    // revert to original styling
                    zone.style.borderColor = '';
                    zone.style.background = '#1a2332';
                });
                zone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const fragType = e.dataTransfer.getData('fragment-type');
                    const acceptedType = zone.dataset.accept;

                    // Reset zone visual
                    zone.style.borderColor = '';
                    zone.style.background = '#1a2332';

                    // Type check: only accept matching types
                    if (fragType !== acceptedType) {
                        zone.style.borderColor = '#e74c3c';
                        zone.style.background = 'rgba(231,76,60,0.15)';
                        setTimeout(() => {
                            zone.style.borderColor = '';
                            zone.style.background = '#1a2332';
                        }, 600);
                        return;
                    }

                    // If zone already has a fragment, put it back in the pool
                    const existing = zone.querySelector('.code-fragment');
                    if (existing) {
                        const pool = document.querySelector('.code-fragment')?.closest('[style*="display: flex"]');
                        if (pool) {
                            existing.style.opacity = '1';
                            pool.appendChild(existing);
                        }
                    }

                    // Move the dragged fragment into the zone
                    const draggedEl = window.__draggingFragment;
                    if (draggedEl) {
                        zone.innerHTML = '';
                        draggedEl.style.opacity = '1';
                        zone.appendChild(draggedEl);
                        zone.style.borderStyle = 'solid';
                        zone.style.borderColor = '#00ff88';
                    }
                });

                // Allow clicking a placed fragment to return it to pool
                zone.addEventListener('click', (e) => {
                    const placed = zone.querySelector('.code-fragment');
                    if (placed) {
                        const pool = document.querySelector('[style*="display: flex"][style*="flex-wrap"]');
                        if (pool) {
                            pool.appendChild(placed);
                            placed.style.opacity = '1';
                            zone.innerHTML = `<span style="color: #666;">Drop fragment here...</span>`;
                            zone.style.borderStyle = 'dashed';
                            zone.style.borderColor = '';
                        }
                    }
                });
            });

            // --- Touch support (mobile) ---
            let touchDragEl = null;
            let touchClone = null;

            fragments.forEach(frag => {
                frag.addEventListener('touchstart', (e) => {
                    touchDragEl = frag;
                    touchClone = frag.cloneNode(true);
                    touchClone.style.position = 'fixed';
                    touchClone.style.pointerEvents = 'none';
                    touchClone.style.opacity = '0.7';
                    touchClone.style.zIndex = '9999';
                    document.body.appendChild(touchClone);
                    frag.style.opacity = '0.4';
                }, { passive: true });

                frag.addEventListener('touchmove', (e) => {
                    if (touchClone) {
                        const touch = e.touches[0];
                        touchClone.style.left = touch.clientX - 40 + 'px';
                        touchClone.style.top = touch.clientY - 15 + 'px';
                    }
                    e.preventDefault();
                }, { passive: false });

                frag.addEventListener('touchend', (e) => {
                    if (touchClone) {
                        document.body.removeChild(touchClone);
                        touchClone = null;
                    }
                    if (touchDragEl) {
                        touchDragEl.style.opacity = '1';
                        const touch = e.changedTouches[0];
                        const target = document.elementFromPoint(touch.clientX, touch.clientY);
                        const zone = target?.closest('.drop-zone');
                        if (zone && touchDragEl.dataset.type === zone.dataset.accept) {
                            const existing = zone.querySelector('.code-fragment');
                            if (existing) {
                                const pool = document.querySelector('[style*="display: flex"][style*="flex-wrap"]');
                                if (pool) pool.appendChild(existing);
                            }
                            zone.innerHTML = '';
                            zone.appendChild(touchDragEl);
                            zone.style.borderStyle = 'solid';
                            zone.style.borderColor = '#00ff88';
                        }
                        touchDragEl = null;
                    }
                });
            });

            // --- EXECUTE ALGORITHM button handler ---
            const execBtn = document.getElementById('execute-algorithm-btn');
            if (execBtn) {
                execBtn.addEventListener('click', () => {
                    const outputDiv = document.getElementById('execution-output');
                    const outputContent = document.getElementById('output-content');
                    const seedInput = document.getElementById('seed-input');
                    if (!outputDiv || !outputContent) return;

                    outputDiv.style.display = 'block';

                    // Gather placed fragments in slot order
                    const slots = ['import', 'def', 'logic1', 'logic2', 'logic3', 'return'];
                    const placed = {};
                    let allFilled = true;

                    slots.forEach(slotName => {
                        const zone = document.querySelector(`.drop-zone[data-slot="${slotName}"]`);
                        const frag = zone?.querySelector('.code-fragment');
                        if (frag) {
                            placed[slotName] = frag.dataset.code || frag.textContent.trim();
                        } else {
                            allFilled = false;
                        }
                    });

                    if (!allFilled) {
                        outputContent.style.color = '#e74c3c';
                        outputContent.innerHTML = '❌ ERROR: All logic slots must be filled before execution.';
                        return;
                    }

                    const seed = seedInput?.value?.trim();
                    if (!seed) {
                        outputContent.style.color = '#e74c3c';
                        outputContent.innerHTML = '❌ ERROR: Seed input is required.';
                        return;
                    }

                    // Validate correct assembly order
                    const correctOrder = [
                        'import hashlib',
                        'def generate_key(seed):',
                        'salted = seed + ARCHITECT_SALT_2026',
                        'hashed = hashlib.sha256(salted.encode()).hexdigest()',
                        'key = KEY_ + hashed[::-1][:16].upper()',
                        'return key'
                    ];

                    const userOrder = slots.map(s => placed[s]);

                    const isCorrectAssembly = userOrder.every((code, i) => code === correctOrder[i]);

                    if (!isCorrectAssembly) {
                        // Wrong assembly → garbage output
                        const garbage = Array.from({ length: 32 }, () =>
                            '0123456789abcdef!@#$%'[Math.floor(Math.random() * 21)]
                        ).join('');
                        outputContent.style.color = '#e74c3c';
                        outputContent.innerHTML = '<span style="color:#e74c3c">⚠️ SYNTAX ERROR: Assembly invalid</span><br><br>' +
                            '<span style="color:#666">Debug output: ' + garbage + '</span><br>' +
                            '<span style="color:#888; font-size:0.8em">Check your fragment order and try again.</span>';
                        return;
                    }

                    // Correct assembly → compute key using JS equivalent of the Python algorithm
                    outputContent.style.color = '#f39c12';
                    outputContent.innerHTML = '⏳ Compiling... executing algorithm...';

                    setTimeout(async () => {
                        try {
                            const salted = seed + 'ARCHITECT_SALT_2026';
                            const encoder = new TextEncoder();
                            const data = encoder.encode(salted);
                            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                            const hashArray = Array.from(new Uint8Array(hashBuffer));
                            const hashed = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                            const reversed = hashed.split('').reverse().join('');
                            const computedKey = 'KEY_' + reversed.substring(0, 16).toUpperCase();

                            outputContent.style.color = '#00ff88';
                            outputContent.innerHTML = '✅ Execution successful!<br><br>' +
                                '<span style="font-size:1.4em; color:#00ff88; text-shadow:0 0 10px #00ff88;">' + computedKey + '</span><br><br>' +
                                '<span style="color:#888; font-size:0.85em;">Copy this key and submit it as your flag ↓</span>';
                        } catch (err) {
                            outputContent.style.color = '#e74c3c';
                            outputContent.innerHTML = '❌ RUNTIME ERROR: ' + err.message;
                        }
                    }, 1500);
                });
            }

        }, 150);

        return () => clearTimeout(timer);
    }, [stage]);

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
                            <div className="hint-section" style={{ marginTop: '20px', padding: '15px', background: '#1c1c2b', borderRadius: '10px' }}>
                                {!hintRevealed ? (
                                    <button
                                        className="btn-hint"
                                        onClick={handleHintReveal}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            background: 'rgba(243, 156, 18, 0.1)',
                                            border: '1px dashed #f39c12',
                                            color: '#f39c12',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        💡 Reveal Hint (Costs 25% Stage Points)
                                    </button>
                                ) : (
                                    <div className="revealed-hints">
                                        <h4 style={{ color: '#f39c12', marginBottom: '10px' }}>💡 Stage Hints (25% Deduction Applied):</h4>
                                        <ul style={{ color: '#ccc', paddingLeft: '20px' }}>
                                            {stage.hints && stage.hints.map((hint, idx) => (
                                                <li key={idx} style={{ marginBottom: '8px' }} dangerouslySetInnerHTML={{ __html: hint }}></li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <h3 style={{ marginTop: '30px' }}>🔑 Submit Your Flag</h3>
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
