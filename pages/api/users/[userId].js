
import { connectToDatabase } from '../../../util/mongodb.js';


export default async (req, res) => {
    if (req.method !== 'GET') {
        res.status(400).send({ message: "Only POST requests are allowed" });
        return;
    }
    const { userId } = req.query;
    const { db } = await connectToDatabase();
    const collection = db.collection('users');
    let user = await collection.findOne({ "uid": userId });
    user = JSON.stringify(user);
    res.status(200).json(user);
}