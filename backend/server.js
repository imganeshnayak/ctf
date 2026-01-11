// TEMPORARY: Run seed script on startup in production
if (process.env.SEED_ON_START === 'true') {
    import('./seed.js').then(() => {
        console.log('Database seeded. Exiting.');
        process.exit(0);
    });
}
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/users.js';
import stageRoutes from './routes/stages.js';
import leaderboardRoutes from './routes/leaderboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/stages', stageRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Secret transmission endpoint for Stage 5
app.get('/api/secret-transmission', (req, res) => {
    // The flag is "NETWORK_MASTER"
    // Step 1: Reverse it -> "RETSAM_KROWTEN"
    // Step 2: Encode with ROT13 -> "ERFGNZ_XEBJGRA"
    res.status(200).json({
        success: true,
        message: 'ERFGNZ_XEBJGRA',
        encoding: 'ROT13 + Reversed',
        hint: 'Decode from ROT13 first, then reverse the string!'
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
