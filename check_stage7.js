import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './backend/config/db.js';
import Stage from './backend/models/Stage.js';

dotenv.config({ path: './backend/.env' });

const checkStage7 = async () => {
    try {
        await connectDB();

        const stage7 = await Stage.findOne({ stageNumber: 7 });

        if (stage7) {
            console.log('='.repeat(70));
            console.log('  STAGE 7 - CURRENT DATABASE STATUS');
            console.log('='.repeat(70));
            console.log();
            console.log(`Stage Number: ${stage7.stageNumber}`);
            console.log(`Title: ${stage7.title}`);
            console.log(`Description: ${stage7.description}`);
            console.log(`Difficulty: ${stage7.difficulty}`);
            console.log(`Points: ${stage7.points}`);
            console.log(`Correct Key: ${stage7.correctKey}`);
            console.log();
            console.log('Hints:');
            stage7.hints.forEach((hint, i) => {
                console.log(`  ${i + 1}. ${hint}`);
            });
            console.log();
            console.log('='.repeat(70));

            if (stage7.title === 'Hash Identifier') {
                console.log('✅ SUCCESS! Stage 7 has been updated to Hash Identifier!');
            } else {
                console.log('❌ Stage 7 is still showing as:', stage7.title);
            }
        } else {
            console.log('❌ Stage 7 not found in database!');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkStage7();
