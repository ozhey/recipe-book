
import { connectToDatabase } from '../../../util/mongodb.js';


export default async (req, res) => {
    if (req.method !== 'POST') {
        res.status(400).send({ message: "Only POST requests are allowed" })
        return;
    }
    const { db } = await connectToDatabase();
    const collection = db.collection('users');
    const user = { ...req.body };
    user['recipes'] = [];
    user['favorites'] = [];
    const result = await collection.insertOne(user);
    res.status(200).json({ data: result })
}