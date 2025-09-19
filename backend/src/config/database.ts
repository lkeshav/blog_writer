import mongoose from 'mongoose';

export async function connectToDatabase(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not set');
  }
  await mongoose.connect(mongoUri);
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
}


