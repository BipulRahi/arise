const mongoose = require('mongoose');
require('dotenv').config()


const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.url);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error  ')
  }
};

module.exports 
 = connectToMongoDB;