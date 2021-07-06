
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../util/mongodb.js';


export default async (req, res) => {
    if (req.method !== 'PATCH') {
        res.status(400).send({ message: "Only POST requests are allowed" })
        return;
    }
    try {
        const { db } = await connectToDatabase();
        const recipes = db.collection('recipes');
        const { recipeId } = req.query;
        if (req.body.type === 'comment') {
            const { name, comment } = req.body;
            const date = new Date();
            const filter = { _id: ObjectId(recipeId) };
            const commentToInsert = { name, comment, date };
            const updateDoc = {
                $push: { comments: commentToInsert }
            }
            const result = await recipes.updateOne(filter, updateDoc);
            res.status(200).json({ message: 'success' });
        } else if (req.body.type === 'rating') {
            const { rating } = req.body;
            const filter = { _id: ObjectId(recipeId) }
            console.log('hi');
            const projection = { projection: { rating: 1, reviews: 1, _id: 0 } }
            const result = await recipes.findOne(filter, projection);
            const newRating = ((result.rating * result.reviews) + rating) / (result.reviews + 1)
            const updateDoc = {
                $set: {
                    rating: newRating,
                    reviews: result.reviews + 1
                }
            }
            await recipes.updateOne(filter, updateDoc)
            res.status(200).json({ message: 'success' });
        }
    } catch {
        res.status(500);
    }
}