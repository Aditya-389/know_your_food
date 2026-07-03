import express from 'express';
import authRoutes from './routes/auth';

const app = express();


app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send("Helath check");
});

export default app;


