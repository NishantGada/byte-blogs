import { Router, Request, Response } from 'express';
import docClient from '../utils/dynamoClient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const TABLE_NAME = 'users';

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
    try {
        console.log("inside AuthController");
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

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Check if user already exists
        const existingUser = await docClient.get({
            TableName: TABLE_NAME,
            Key: { username },
        }).promise();

        if (existingUser.Item) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in DynamoDB
        await docClient.put({
            TableName: TABLE_NAME,
            Item: {
                username,
                password: hashedPassword,
                createdAt: new Date().toISOString(),
            },
        }).promise();

        // Generate token for immediate login
        const token = jwt.sign(
            { username },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        res.status(201).json({ 
            message: 'User created successfully',
            token 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Registration failed', error });
    }
});

router.post('/change-password', async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const username = decoded.username;

        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new passwords are required' });
        }

        // Fetch user from DynamoDB
        const result = await docClient.get({
            TableName: TABLE_NAME,
            Key: { username },
        }).promise();

        if (!result.Item) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, result.Item.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in DynamoDB
        await docClient.update({
            TableName: TABLE_NAME,
            Key: { username },
            UpdateExpression: 'set password = :p',
            ExpressionAttributeValues: {
                ':p': hashedPassword,
            },
        }).promise();

        res.json({ message: 'Password updated successfully' });

    } catch (error: any) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired, please login again' });
        }
        res.status(500).json({ message: 'Failed to update password', error });
    }
});

export default router;
