import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Stage from '../models/Stage.js';
import { stages12to14 } from '../data/stages12to14.js';

dotenv.config();

const targetStageNumbers = stages12to14.map((stage) => stage.stageNumber);

const addStages12to14 = async () => {
  try {
    await connectDB();

    // Remove old versions of stages 12-14 so we can insert the new ones
    await Stage.deleteMany({ stageNumber: { $in: targetStageNumbers } });
    await Stage.insertMany(stages12to14);

    console.log('=== Stage 12-14 Replacement Complete ===');
    console.log('Scope: stages 12-14 only (other stages untouched)');
    console.log(`Replaced ${stages12to14.length} stages:`);
    stages12to14.forEach(s => {
      console.log(`  Stage ${s.stageNumber}: ${s.title} (${s.difficulty}, ${s.points}pts)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error while adding stages 12-14:', error);
    process.exit(1);
  }
};

addStages12to14();
