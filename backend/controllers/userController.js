import User from '../models/User.js';

// Create or get user by username
export const createOrGetUser = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username || username.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Username must be at least 3 characters long'
            });
        }

        // Find existing user or create new one
        let user = await User.findOne({ username: username.trim() });

        if (!user) {
            user = await User.create({
                username: username.trim(),
                currentStage: 1,
                completedStages: [],
                totalScore: 0
            });
        } else {
            // Update last activity
            user.lastActivity = Date.now();
            await user.save();
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user progress
export const getUserProgress = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                username: user.username,
                currentStage: user.currentStage,
                completedStages: user.completedStages,
                totalScore: user.totalScore
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Reset user progress
export const resetProgress = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.currentStage = 1;
        user.completedStages = [];
        user.submissions = [];
        user.totalScore = 0;
        await user.save();

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
