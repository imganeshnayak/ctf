import express from 'express';
import { createOrGetUser, getUserProgress, resetProgress, deductPoints } from '../controllers/userController.js';

const router = express.Router();

router.post('/session', createOrGetUser);
router.get('/:id/progress', getUserProgress);
router.post('/:id/reset', resetProgress);
router.post('/:id/deduct', deductPoints);

export default router;
