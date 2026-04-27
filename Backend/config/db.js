const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // process.env.MONGO_URI pulls the string from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Connection Error: ${error.message}`);
    process.exit(1); // Stops the server if the connection fails
  }
};

module.exports = connectDB;