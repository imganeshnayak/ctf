import Stage from '../models/Stage.js';
import User from '../models/User.js';
import { generateDynamicStage7 } from '../utils/stage7Generator.js';

// Get all stages (only show content for unlocked stages)
export const getAllStages = async (req, res) => {
    try {
        const { userId } = req.query;

        const stages = await Stage.find().sort({ stageNumber: 1 });

        if (!userId) {
            // Return basic info without challenge content
            const stagesInfo = stages.map(stage => ({
                _id: stage._id,
                stageNumber: stage.stageNumber,
                title: stage.title,
                description: stage.description,
                difficulty: stage.difficulty,
                points: stage.points,
                locked: true
            }));

            return res.status(200).json({
                success: true,
                data: stagesInfo
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Show full content for ALL stages (no locking)
        const stagesWithAccess = stages.map(stage => {
            const isCompleted = user.completedStages.includes(stage.stageNumber);

            // Generate dynamic content for Stage 7
            let challengeContent = stage.challengeContent;
            if (stage.stageNumber === 7) {
                challengeContent = generateDynamicStage7(userId);
            }

            // Check if hint is unlocked for this stage
            const hintUnlocked = user.hintUsedStages.includes(stage.stageNumber);

            // All stages are unlocked
            return {
                _id: stage._id,
                stageNumber: stage.stageNumber,
                title: stage.title,
                description: stage.description,
                difficulty: stage.difficulty,
                challengeContent: challengeContent,
                hints: stage.hints,
                mcq: stage.mcq,
                points: stage.points,
                locked: false,  // All stages are unlocked
                completed: isCompleted,
                hintUnlocked: hintUnlocked
            };
        });

        res.status(200).json({
            success: true,
            data: stagesWithAccess
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Validate submitted key
export const validateKey = async (req, res) => {
    try {
        const { userId, submittedKey } = req.body;
        const stageId = req.params.id;

        const stage = await Stage.findById(stageId);
        const user = await User.findById(userId);

        if (!stage || !user) {
            return res.status(404).json({
                success: false,
                message: 'Stage or user not found'
            });
        }

        // Validate key (normalized: lowercase and no whitespace)
        const normalizedSubmitted = submittedKey.replace(/\s+/g, '').toLowerCase();
        const normalizedCorrect = stage.correctKey.replace(/\s+/g, '').toLowerCase();
        const isCorrect = normalizedSubmitted === normalizedCorrect;

        if (isCorrect) {
            // Check if already completed
            if (!user.completedStages.includes(stage.stageNumber)) {
                // Check for hint deduction (25%)
                let pointsToAward = stage.points;
                if (user.hintUsedStages.includes(stage.stageNumber)) {
                    pointsToAward = Math.floor(stage.points * 0.75);
                }

                user.completedStages.push(stage.stageNumber);
                user.totalScore += pointsToAward;

                // Record submission with timestamp for leaderboard
                user.submissions.push({
                    stageId: stage._id,
                    stageNumber: stage.stageNumber,
                    completedAt: new Date(),
                    points: pointsToAward
                });

                // Move to next stage if this was the current stage
                if (stage.stageNumber === user.currentStage) {
                    user.currentStage = stage.stageNumber + 1;
                }

                await user.save();
            }

            return res.status(200).json({
                success: true,
                message: 'Correct! Stage completed!',
                data: {
                    currentStage: user.currentStage,
                    completedStages: user.completedStages,
                    totalScore: user.totalScore
                }
            });
        } else {
            // Stage 16 special hint: if user submits the known mangled variant
            let incorrectMsg = 'Incorrect key. Try again!';
            if (stage.stageNumber === 16) {
                const normalized = submittedKey.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
                const knownWrong = ['mastrfallstag3s', 'mastrofallstages', 'mast#r_()f_all_stag3s'.replace(/[^a-z0-9_]/g, '')];
                if (knownWrong.some(w => normalized.includes(w.replace(/[^a-z0-9]/g, '')) || w.includes(normalized))) {
                    incorrectMsg = '🔤 Almost — but check your spelling carefully before re-submitting!';
                }
            }
            return res.status(400).json({
                success: false,
                message: incorrectMsg
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Unlock hint for a stage
export const unlockHint = async (req, res) => {
    try {
        const { userId } = req.body;
        const stageId = req.params.id;

        const stage = await Stage.findById(stageId);
        const user = await User.findById(userId);

        if (!stage || !user) {
            return res.status(404).json({
                success: false,
                message: 'Stage or user not found'
            });
        }

        // Add to hintUsedStages if not already there
        if (!user.hintUsedStages.includes(stage.stageNumber)) {
            user.hintUsedStages.push(stage.stageNumber);
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: 'Hint unlocked!',
            data: {
                hintUsedStages: user.hintUsedStages
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Submit MCQ answer for bonus points
export const submitMcq = async (req, res) => {
    try {
        const { userId, selectedIndex } = req.body;
        const stageId = req.params.id;

        const stage = await Stage.findById(stageId);
        const user = await User.findById(userId);

        if (!stage || !user) {
            return res.status(404).json({
                success: false,
                message: 'Stage or user not found'
            });
        }

        // Guard: MCQ bonus can only be won once per stage
        if (user.mcqBonusStages.includes(stage.stageNumber)) {
            return res.status(200).json({
                success: true,
                correct: false,
                bonusPoints: 0,
                totalScore: user.totalScore,
                message: 'MCQ bonus already claimed for this stage.'
            });
        }

        const isCorrect = selectedIndex === stage.mcq.correctIndex;
        let bonusPoints = 0;

        if (isCorrect) {
            bonusPoints = 100;
            user.totalScore += bonusPoints;
            user.mcqBonusStages.push(stage.stageNumber);
            await user.save();
        }

        res.status(200).json({
            success: true,
            correct: isCorrect,
            bonusPoints,
            totalScore: user.totalScore
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

