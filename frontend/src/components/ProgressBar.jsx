import React from 'react';

const ProgressBar = ({ completed, total }) => {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="progress-bar-container">
            <div className="progress-bar-header">
                <span>Progress</span>
                <span>{completed} / {total} Stages Completed</span>
            </div>
            <div className="progress-bar-bg">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
