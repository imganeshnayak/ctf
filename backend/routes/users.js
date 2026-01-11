import express from 'express';
import { createOrGetUser, getUserProgress, resetProgress } from '../controllers/userController.js';

const router = express.Router();

router.post('/session', createOrGetUser);
router.get('/:id/progress', getUserProgress);
router.post('/:id/reset', resetProgress);

export default router;
