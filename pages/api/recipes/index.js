
import { connectToDatabase } from '../../../util/mongodb.js';


export default async (req, res) => {
    if (req.method !== 'POST') {
        res.status(400).send({ message: "Only POST requests are allowed" })
        return;
    }
    try {
        const { db } = await connectToDatabase();

        const recipes = db.collection('recipes');
        const recipe = { ...req.body };
        const recipeInsertResult = await recipes.insertOne(recipe);

        const users = db.collection('users');
        const filter = { uid: recipe.uid };
        const updateDoc = {
            $push: { recipes: recipeInsertResult.insertedId }
        }
        const userUpdateResult = await users.updateOne(filter, updateDoc);
        res.status(200).json({ message: 'inserted successfuly' })
    } catch {
        res.status(500);
    }
}