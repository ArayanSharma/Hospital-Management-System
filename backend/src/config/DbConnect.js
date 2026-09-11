import mongoose from "mongoose";
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Ensure Node.js DNS uses IPv4 first & Google DNS to resolve MongoDB Atlas SRV lookups on Windows
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignore if not supported in environment
}

 
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