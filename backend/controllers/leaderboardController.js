import User from '../models/User.js';

// Get leaderboard with rankings
export const getLeaderboard = async (req, res) => {
    try {
        // Fetch all users with their submissions
        const users = await User.find({})
            .select('username totalScore completedStages submissions')
            .lean();

        // Calculate ranking metrics for each user
        const rankedUsers = users.map(user => {
            const completedCount = user.completedStages?.length || 0;

            // Get the timestamp of the last completed stage
            let lastCompletionTime = null;
            if (user.submissions && user.submissions.length > 0) {
                // Sort submissions by completedAt and get the latest
                const sortedSubmissions = [...user.submissions].sort(
                    (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
                );
                lastCompletionTime = sortedSubmissions[0].completedAt;
            }

            return {
                username: user.username,
                totalScore: user.totalScore || 0,
                completedStages: completedCount,
                lastCompletionTime: lastCompletionTime,
                // For tie-breaking: use earliest completion time
                firstCompletionTime: user.submissions?.[0]?.completedAt || null
            };
        });

        // Sort by:
        // 1. Number of completed stages (descending)
        // 2. Total score (descending) - Rewards avoiding hints
        // 3. Earliest first completion time (ascending) - Fine-grained tie-breaker
        rankedUsers.sort((a, b) => {
            // Primary: More completed stages is better
            if (b.completedStages !== a.completedStages) {
                return b.completedStages - a.completedStages;
            }

            // Secondary: Higher score is better (rewards those who didn't use hints)
            if (b.totalScore !== a.totalScore) {
                return b.totalScore - a.totalScore;
            }

            // Tertiary: Earlier completion time is better (tie-breaker for same completions and score)
            if (a.firstCompletionTime && b.firstCompletionTime) {
                return new Date(a.firstCompletionTime) - new Date(b.firstCompletionTime);
            }

            // If one has completion time and other doesn't
            if (a.firstCompletionTime && !b.firstCompletionTime) return -1;
            if (!a.firstCompletionTime && b.firstCompletionTime) return 1;

            return 0;
        });

        // Add rank position
        const leaderboard = rankedUsers.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            totalScore: user.totalScore,
            completedStages: user.completedStages,
            lastCompletionTime: user.lastCompletionTime
        }));

        res.status(200).json({
            success: true,
            data: leaderboard
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
