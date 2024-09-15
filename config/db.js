const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/yourDatabaseName';

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error  ')
  }
};

module.exports 
 = connectToMongoDB;