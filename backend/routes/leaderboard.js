import express from 'express';
import { getLeaderboard } from '../controllers/leaderboardController.js';

const router = express.Router();

// GET /api/leaderboard - Get ranked list of all users
router.get('/', getLeaderboard);

export default router;
