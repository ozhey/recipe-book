
import { connectToDatabase } from '../../../util/mongodb.js';


export default async (req, res) => {
    if (req.method !== 'POST') {
        res.status(400).send({ message: "Only POST requests are allowed" })
        return;
    }
    const { db } = await connectToDatabase();
    const collection = db.collection('recipes');
    const recipe = { ...req.body };
    const result = await collection.insertOne(recipe);
    console.log(recipe);
    res.status(200).json({ data: req.body })
}