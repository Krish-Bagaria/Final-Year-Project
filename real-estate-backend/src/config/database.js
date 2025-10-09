import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`
    ┌─────────────────────────────────────────────────┐
    │  ✅ MongoDB Connected Successfully!             │
    │  Host: ${conn.connection.host.padEnd(33)}│
    │  Database: ${conn.connection.name.padEnd(29)}│
    └─────────────────────────────────────────────────┘
    `);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully!');
    });

  } catch (error) {
    console.error(`
    ┌─────────────────────────────────────────────────┐
    │  ❌ MongoDB Connection Failed!                  │
    │  Error: ${error.message.padEnd(33)}│
    └─────────────────────────────────────────────────┘
    `);
    process.exit(1);
  }
};

export default connectDB;