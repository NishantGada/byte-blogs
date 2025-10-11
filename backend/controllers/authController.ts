import { Router, Request, Response } from 'express';
import docClient from '../utils/dynamoClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const TABLE_NAME = 'users';

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
    try {
        console.log("here!");
        const { username, password } = req.body;

        // Fetch user from DynamoDB
        const result = await docClient.get({
            TableName: TABLE_NAME,
            Key: { username },
        }).promise();

        if (!result.Item) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, result.Item.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { username },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
});

export default router;
