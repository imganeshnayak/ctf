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

            // All stages are unlocked
            return {
                _id: stage._id,
                stageNumber: stage.stageNumber,
                title: stage.title,
                description: stage.description,
                difficulty: stage.difficulty,
                challengeContent: challengeContent,
                hints: stage.hints,
                points: stage.points,
                locked: false,  // All stages are unlocked
                completed: isCompleted
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

        // Validate key (case-insensitive)
        const isCorrect = submittedKey.trim().toLowerCase() === stage.correctKey.toLowerCase();

        if (isCorrect) {
            // Check if already completed
            if (!user.completedStages.includes(stage.stageNumber)) {
                user.completedStages.push(stage.stageNumber);
                user.totalScore += stage.points;

                // Record submission with timestamp for leaderboard
                user.submissions.push({
                    stageId: stage._id,
                    stageNumber: stage.stageNumber,
                    completedAt: new Date(),
                    points: stage.points
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
            return res.status(400).json({
                success: false,
                message: 'Incorrect key. Try again!'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
