import React from 'react';

const StageCard = ({ stage, onClick }) => {
    const { stageNumber, title, description, difficulty, points, locked, completed } = stage;

    const getDifficultyBadgeClass = (diff) => {
        switch (diff?.toLowerCase()) {
            case 'easy':
                return 'badge-easy';
            case 'medium':
                return 'badge-medium';
            case 'hard':
                return 'badge-hard';
            default:
                return 'badge-easy';
        }
    };

    const getStatusIcon = () => {
        if (completed) return '✓';
        if (locked) return '🔒';
        return '▶';
    };

    const getStatusText = () => {
        if (completed) return 'Completed';
        if (locked) return 'Locked';
        return 'Start';
    };

    const cardClass = `stage-card ${locked ? 'locked' : ''} ${completed ? 'completed' : ''} fade-in`;

    return (
        <div
            className={cardClass}
            onClick={() => !locked && onClick(stage)}
        >
            <div className="stage-header">
                <div className="stage-number">#{stageNumber}</div>
                <div className={`stage-badge ${getDifficultyBadgeClass(difficulty)}`}>
                    {difficulty}
                </div>
            </div>

            <h3 className="stage-title">{title}</h3>
            <p className="stage-description">{description}</p>

            <div className="stage-footer">
                <div className="stage-points">🏆 {points} pts</div>
                <div className="stage-status">
                    <span className="status-icon">{getStatusIcon()}</span>
                    <span>{getStatusText()}</span>
                </div>
            </div>
        </div>
    );
};

export default StageCard;
