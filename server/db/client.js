const mongoose = require('mongoose');
const config = require('config');
const dbConfig = config.get('db');

const connectDB = async () => {
  try {
    console.log(`connecting to ${dbConfig.dialect}://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`)
    await mongoose.connect(`${dbConfig.dialect}://${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`, {
      serverSelectionTimeoutMS: 1000,
    });
    console.log('Successfully connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    throw err.message;
  }
};

module.exports = connectDB;
