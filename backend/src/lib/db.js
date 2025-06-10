import mongoose from 'mongoose';
import dotenv from 'dotenv/config';

export default async function connectDb() {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDb conniction successfully`)
    } catch(error){
        console.log(`MongoDb conection faild: ${error.message}`);
    }
}