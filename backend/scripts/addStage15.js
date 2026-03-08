import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Stage from '../models/Stage.js';
import { stage15 } from '../data/stage15.js';

dotenv.config();

const addOrUpdateStage15 = async () => {
  try {
    await connectDB();

    const result = await Stage.updateOne(
      { stageNumber: stage15.stageNumber },
      { $set: stage15 },
      { upsert: true }
    );

    const inserted = result.upsertedCount > 0;
    const modified = result.modifiedCount > 0;

    console.log('=== Stage 15 Rollout Complete ===');
    console.log('Scope: stage 15 only (other stages untouched)');
    console.log(`Action: ${inserted ? 'inserted' : modified ? 'updated' : 'no changes needed'}`);
    console.log(`Stage ${stage15.stageNumber}: ${stage15.title} (${stage15.difficulty}, ${stage15.points}pts)`);

    process.exit(0);
  } catch (error) {
    console.error('Error while adding/updating stage 15:', error);
    process.exit(1);
  }
};

addOrUpdateStage15();
