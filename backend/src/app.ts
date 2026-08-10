import express from 'express';
import pool from './config/db'; 
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';

const app = express();

pool.connect();

// heath check
app.get('/', (req, res) => {
    res.send("Helath check");
});

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);

export default app;