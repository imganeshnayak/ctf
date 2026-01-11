import express from 'express';
import { getAllStages, validateKey } from '../controllers/stageController.js';

const router = express.Router();

router.get('/', getAllStages);
router.post('/:id/validate', validateKey);

export default router;
