
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../util/mongodb.js';


export default async (req, res) => {
    if (req.method !== 'PATCH') {
        res.status(400).send({ message: "Only POST requests are allowed" })
        return;
    }
    try {
        if (req.body.type === 'comment') {
            const { recipeId, name, comment } = req.body;
            const date = new Date();
            const { db } = await connectToDatabase();
            const recipes = db.collection('recipes');
            const filter = { _id: ObjectId(recipeId) };
            const commentToInsert = { name, comment, date };
            const updateDoc = {
                $push: { comments: commentToInsert }
            }
            const result = await recipes.updateOne(filter, updateDoc);
            res.status(200).json(commentToInsert);
        }
    } catch {
        res.status(500);
    }
}