import express from 'express';
import { getAllStages, validateKey, unlockHint } from '../controllers/stageController.js';

const router = express.Router();

router.get('/', getAllStages);
router.post('/:id/validate', validateKey);
router.post('/:id/unlock-hint', unlockHint);

export default router;
