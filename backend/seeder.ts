import AWS from 'aws-sdk';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ debug: false });
const USER_TABLE = process.env.USER_TABLE_NAME!;

const docClient = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });

const seedAdmin = async () => {
    const username = 'admin';
    const password = await bcrypt.hash('admin123', 10);

    await docClient.put({
        TableName: USER_TABLE,
        Item: { username, password }
    }).promise();

    console.log('Admin user created!');
};

seedAdmin();
