import express from 'express';
import { getTimer, startTimer, stopTimer } from '../controllers/timerController.js';

const router = express.Router();

router.get('/', getTimer);
router.post('/start', startTimer);
router.post('/stop', stopTimer); // optional

export default router;
