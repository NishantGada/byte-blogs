import { Router, Request, Response } from 'express';
import docClient from '../utils/dynamoClient';
import { randomUUID } from 'crypto';
import { authMiddleware } from '../middleware/authMiddleware';
import { slugify, blogSlug, uniqueSlug } from '../utils/slug';
import dotenv from 'dotenv';
dotenv.config({ debug: false });

const router = Router();
const TABLE_NAME = process.env.BLOG_TABLE_NAME!;

const EXCERPT_CHARS = 200;

// Build a short plain-text preview from stored HTML content, so the list
// endpoint doesn't have to ship every post's full body to the browser.
const makeExcerpt = (html: string): string => {
    const text = (html || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (text.length <= EXCERPT_CHARS) return text;
    return text.slice(0, EXCERPT_CHARS).trimEnd() + '…';
};

// GET /api/blogs → public. Returns a lightweight list: no full content, just an
// excerpt and the fields the cards render. Each item is guaranteed a slug.
router.get('/', async (_req: Request, res: Response) => {
    try {
        const data = await docClient.scan({ TableName: TABLE_NAME }).promise();
        const blogs = (data.Items ?? [])
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((b) => ({
                id: b.id,
                slug: blogSlug(b),
                title: b.title,
                category: b.category,
                coverImage: b.coverImage,
                createdAt: b.createdAt,
                updatedAt: b.updatedAt,
                excerpt: makeExcerpt(b.content),
            }));
        res.json(blogs);
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).json({ message: 'Error fetching blogs' });
    }
});

// GET specific blog /api/blogs/:slug → public.
// Accepts either a slug (public URLs) or a UUID id (admin edit + legacy links).
router.get('/:slug', async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        // Fast path: direct primary-key lookup (UUID id).
        const byId = await docClient.get({ TableName: TABLE_NAME, Key: { id: slug } }).promise();
        if (byId.Item) {
            return res.json(byId.Item);
        }

        // Otherwise resolve by slug (stored, or derived from the title).
        const data = await docClient.scan({ TableName: TABLE_NAME }).promise();
        const match = (data.Items ?? []).find((b) => blogSlug(b) === slug);
        if (!match) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(match);
    } catch (err) {
        console.error('Error fetching blog:', err);
        res.status(500).json({ message: 'Error fetching blog' });
    }
});

// POST /api/blogs → protected
router.post('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { title, content, category, coverImage } = req.body;

        // Generate a unique slug from the title, checking against existing posts.
        const existing = await docClient.scan({ TableName: TABLE_NAME }).promise();
        const taken = new Set((existing.Items ?? []).map((b) => blogSlug(b)));
        const slug = uniqueSlug(slugify(title), taken);

        const blog = {
            id: randomUUID(),
            slug,
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
        console.error('Error creating blog:', err);
        res.status(500).json({ message: 'Error creating blog' });
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
            res.status(404).json({ message: 'Something went wrong. Check if ID exists' });
        }
    } catch (err) {
        console.error('Error updating blog:', err);
        res.status(500).json({ message: 'Error updating blog' });
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
            return res.status(404).json({ message: 'Something went wrong. Check if ID exists' });
        }

        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        console.error('Error deleting blog:', err);
        res.status(500).json({ message: 'Error deleting blog' });
    }
});

export default router;
