import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import blogRoutes from './controllers/blogController';
import authRoutes from './controllers/authController';

dotenv.config({ debug: false });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (_req, res) => {
    console.log("calling root api");
    res.send('Blog API running...')
});
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
