import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

export async function connectToDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');
    return mongoose.connection;
  } catch (error) {
    console.warn('MongoDB connection unavailable. Continuing without the database connection.', error);
    return mongoose.connection;
  }
}

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

export default mongoose.connection;
