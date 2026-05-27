import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import blogRoutes from './controllers/blogController';
import authRoutes from './controllers/authController';

dotenv.config({ debug: false });

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
    res.send('Blog API running...');
});
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

export default app;
