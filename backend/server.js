import dotenv from 'dotenv';
dotenv.config();
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';

// Import routes
import recipeRoutes from './routes/recipeRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Create Express application
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(json()); // Parse JSON bodies

// Database Connection
connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/testUser', userRoutes);

// Global error handler (basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});