import { Router, Request, Response } from 'express';
import docClient from '../utils/dynamoClient';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middleware/authMiddleware';
import dotenv from 'dotenv';
dotenv.config({ debug: false });

const router = Router();
const TABLE_NAME = process.env.BLOG_TABLE_NAME!;

// GET /api/blogs → public
router.get('/', async (_req: Request, res: Response) => {
    try {
        const data = await docClient.scan({ TableName: TABLE_NAME }).promise();
        const blogs = data.Items?.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching blogs', error: err });
    }
});

// GET specifc Blog /api/blogs/:id → public
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const blog = await docClient.get({ TableName: TABLE_NAME, Key: { id }, }).promise();
        if (!blog.Item) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching blogs', error: err });
    }
});

// POST /api/blogs → protected
router.post('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { title, content, category, coverImage } = req.body;

        const blog = {
            id: uuidv4(),
            title,
            content,
            category,
            coverImage,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await docClient.put({ TableName: TABLE_NAME, Item: blog }).promise();
        res.status(201).json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Error creating blog', error: err });
    }
});

// PUT /api/blogs/:id → protected
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content, category, coverImage } = req.body;

        const params = {
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: 'set title=:t, content=:c, category=:cat, coverImage=:ci, updatedAt=:u',
            ConditionExpression: "attribute_exists(id)",
            ExpressionAttributeValues: {
                ':t': title,
                ':c': content,
                ':cat': category,
                ':ci': coverImage,
                ':u': new Date().toISOString(),
            },
            ReturnValues: 'ALL_NEW',
        };

        try {
            const data = await docClient.update(params).promise();
            res.json(data.Attributes);
        } catch (error) {
            res.status(404).json({ message: 'Something went wrong. Check if ID exists', 'error': error });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating blog', error: err });
    }
});

// DELETE /api/blogs/:id → protected
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletParams = { TableName: TABLE_NAME, Key: { id }, ConditionExpression: "attribute_exists(id)" }

        try {
            await docClient.delete(deletParams).promise();
        } catch (error) {
            res.status(404).json({ message: 'Something went wrong. Check if ID exists', 'error': error });
        }

        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting blog', error: err });
    }
});

export default router;
