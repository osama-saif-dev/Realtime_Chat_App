import express from 'express';
import 'dotenv/config';
import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';
import connectDb from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from './lib/socket.js';
import path from 'path';

const port = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);

if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res, next) => {
        // Check for malformed URLs with colons
        if (req.path.includes('::') || req.path.endsWith(':') || req.path.includes(':/')) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }
        next();
    }, (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
    });

    server.listen(port, () => {
        console.log(`Server is runing on http://localhost:${port}`);
        connectDb();
    })