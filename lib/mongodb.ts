import mongoose from "mongoose";

interface Connection {
  isConnected: mongoose.ConnectionStates | boolean;
}

const connection: Connection = {
  isConnected: false,
};

async function dbConnect(): Promise<void> {
  // Check if we're already connected
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to MongoDB");
    connection.isConnected = true;
    return;
  }

  // Check if connection is currently connecting
  if (mongoose.connection.readyState === 2) {
    console.log("MongoDB connection in progress, waiting...");
    await new Promise((resolve) => {
      mongoose.connection.once('connected', resolve);
    });
    connection.isConnected = true;
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  try {
    // Configure mongoose with better connection options
    mongoose.set('bufferCommands', true); // Allow buffering
    mongoose.set('maxTimeMS', 30000); // Set timeout to 30 seconds
    
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // How long to try selecting a server
      socketTimeoutMS: 45000, // How long to wait for a response
      maxPoolSize: 10, // Maintain up to 10 socket connections
      retryWrites: true, // Retry writes on server restart
      retryReads: true, // Retry reads on server restart
    });
    
    connection.isConnected = db.connection.readyState === 1;
    
    // Set up connection event listeners
    db.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
      connection.isConnected = false;
    });
    
    db.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      connection.isConnected = false;
    });
    
    db.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
      connection.isConnected = true;
    });
    
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    connection.isConnected = false;
    throw new Error("Error connecting to database");
  }
}

async function dbDisconnect(): Promise<void> {
  if (mongoose.connection.readyState === 0) {
    console.log("Already disconnected from MongoDB");
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

// Helper function to ensure connection before database operations
async function ensureConnection(): Promise<void> {
  if (mongoose.connection.readyState !== 1) {
    await dbConnect();
  }
}

// This is to handle hot reloading in development
const db = { 
  connect: dbConnect, 
  disconnect: dbDisconnect,
  ensureConnection 
};

export default db; 