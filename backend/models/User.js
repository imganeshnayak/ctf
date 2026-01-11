import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    currentStage: {
        type: Number,
        default: 1,
        min: 1
    },
    completedStages: [{
        type: Number
    }],
    submissions: [{
        stageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stage'
        },
        stageNumber: Number,
        completedAt: {
            type: Date,
            default: Date.now
        },
        points: Number
    }],
    totalScore: {
        type: Number,
        default: 0
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
