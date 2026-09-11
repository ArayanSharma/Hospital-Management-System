import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

 
//mono connect nhi h to error

if(!process.env.MONGO_URI){
    throw new Error("please provide MONGO_URI in environment variables to connect to MongoDB");
}

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
        
    }catch(error){
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

export default connectDB;