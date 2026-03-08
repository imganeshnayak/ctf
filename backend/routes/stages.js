import express from 'express';
import { getAllStages, validateKey, unlockHint, submitMcq } from '../controllers/stageController.js';

const router = express.Router();

router.get('/', getAllStages);
router.post('/:id/validate', validateKey);
router.post('/:id/unlock-hint', unlockHint);
router.post('/:id/mcq', submitMcq);

export default router;

