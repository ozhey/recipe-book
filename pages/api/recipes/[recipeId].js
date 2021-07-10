
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../util/mongodb.js';


export default async (req, res) => {
    if (req.method === 'PATCH') {
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
    } else if (req.method === 'DELETE') {
        try {
            const { db } = await connectToDatabase();
            const recipes = db.collection('recipes');
            const users = db.collection('users');
            const { recipeId } = req.query;
            await recipes.deleteOne({_id: ObjectId(recipeId)});
            await users.updateMany({}, {
                $pull: {
                    recipes: ObjectId(recipeId),
                    favorites: ObjectId(recipeId)
                }
            });
            res.status(200).json({ message: 'success' });
        } catch {
            res.status(500);
        }
    } else {
        res.status(400).send({ message: "Only PATCH/DELETE requests are allowed" })
    }
}