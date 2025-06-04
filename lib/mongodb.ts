import mongoose from "mongoose";

interface Connection {
  isConnected: mongoose.ConnectionStates | boolean;
}

const connection: Connection = {
  isConnected: false,
};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    
    connection.isConnected = db.connection.readyState;
    
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Error connecting to database");
  }
}

async function dbDisconnect(): Promise<void> {
  if (!connection.isConnected) {
    return;
  }
  
  if (process.env.NODE_ENV === "development") {
    console.log("Not disconnecting from MongoDB in development mode");
    return;
  }
  
  try {
    await mongoose.disconnect();
    connection.isConnected = false;
    console.log("MongoDB disconnected successfully");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
    throw new Error("Error disconnecting from database");
  }
}

// This is to handle hot reloading in development
const db = { connect: dbConnect, disconnect: dbDisconnect };
export default db; 