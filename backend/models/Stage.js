import mongoose from 'mongoose';

const stageSchema = new mongoose.Schema({
    stageNumber: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Easy'
    },
    challengeContent: {
        type: String,
        required: true
    },
    correctKey: {
        type: String,
        required: true
    },
    hints: [{
        type: String
    }],
    points: {
        type: Number,
        default: 100
    }
}, {
    timestamps: true
});

const Stage = mongoose.model('Stage', stageSchema);

export default Stage;
