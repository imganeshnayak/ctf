// TEMPORARY: Run seed script on startup in production
if (process.env.SEED_ON_START === 'true') {
    import('./seed.js').then(() => {
        console.log('Database seeded. Exiting.');
        process.exit(0);
    });
}
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/users.js';
import stageRoutes from './routes/stages.js';
import leaderboardRoutes from './routes/leaderboard.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// ── Socket.io ────────────────────────────────────────────────────────────────
export const io = new SocketIOServer(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

// In-memory lobby state
export const lobbyState = {
    ctfStarted: false,
    ctfStartedAt: null,
    onlineUsers: new Map()   // socketId → { userId, username, joinedAt }
};

io.on('connection', (socket) => {
    // Client joins lobby
    socket.on('join-lobby', ({ userId, username }) => {
        lobbyState.onlineUsers.set(socket.id, { userId, username, joinedAt: Date.now() });
        io.emit('lobby-update', getLobbySnapshot());
        // Send a welcome system message only to this socket
        socket.emit('system-message', { text: `Welcome, ${username}! Waiting for admin to start the CTF.` });
        // Broadcast to everyone else
        socket.broadcast.emit('system-message', { text: `⚡ ${username} joined the lobby.` });
    });

    // Client leaves / disconnects
    socket.on('disconnect', () => {
        const user = lobbyState.onlineUsers.get(socket.id);
        if (user) {
            lobbyState.onlineUsers.delete(socket.id);
            io.emit('lobby-update', getLobbySnapshot());
            io.emit('system-message', { text: `${user.username} left the lobby.` });
        }
    });
});

function getLobbySnapshot() {
    return {
        ctfStarted: lobbyState.ctfStarted,
        ctfStartedAt: lobbyState.ctfStartedAt,
        users: Array.from(lobbyState.onlineUsers.values())
    };
}

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

// Admin endpoints (CTF start / stop)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ctf_admin_2026';

app.post('/api/admin/start-ctf', (req, res) => {
    const { password } = req.body;
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Invalid admin password' });
    }
    lobbyState.ctfStarted = true;
    lobbyState.ctfStartedAt = Date.now();
    io.emit('ctf-start', { message: '🚀 CTF has started! Redirecting to Challenge Arena...' });
    io.emit('lobby-update', getLobbySnapshot());
    res.json({ success: true, message: 'CTF started' });
});

app.post('/api/admin/stop-ctf', (req, res) => {
    const { password } = req.body;
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Invalid admin password' });
    }
    lobbyState.ctfStarted = false;
    lobbyState.ctfStartedAt = null;
    io.emit('ctf-stop', { message: 'CTF has been stopped by admin.' });
    io.emit('lobby-update', getLobbySnapshot());
    res.json({ success: true, message: 'CTF stopped' });
});

app.get('/api/lobby/status', (req, res) => {
    res.json({ success: true, data: getLobbySnapshot() });
});

// Serve frontend static files from frontend/public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '..', 'frontend', 'public');
app.use(express.static(publicPath));

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

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
