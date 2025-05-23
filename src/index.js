import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import authMinaSidorRoutes from './routes/minasidor.js';
import categoryRoutes from './routes/category.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors('*'));
app.use(express.json());

// API Documentation route
app.get('/api', (req, res) => {
  res.json({
    name: "Hakim Livs API",
    version: "1.0.0",
    endpoints: {
      auth: {
        "POST /api/auth/register": "Register a new user",
        "POST /api/auth/login": "Login with username and password",
        "GET /api/auth/minasidor": "Get user info",
        "PUT /api/auth/minasidor": "Update user info",
        "DELETE /api/auth/minasidor/:id": "Delete user permanently"
      },
      products: {
        "GET /api/products": "Get all products",
        "GET /api/products/:id": "Get a single product by ID",
        "POST /api/products": "Create a new product (Admin only)",
        "PUT /api/products/:id": "Update a product (Admin only)",
        "DELETE /api/products/:id": "Delete a product (Admin only)"
      },
      categories: {
        "GET /api/categories": "Get all categories",
        "GET /api/categories/:id": "Get a single category",
        "POST /api/categories": "Create a new category",
        "PUT api/categories/:id": "Update a single category",
        "DELETE /api/categories": "Delete all categories",
        "DELETE api/categories/:id": "Delete a single category"
      }
    },
    authentication: "Use Bearer token in Authorization header for protected routes"
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/minasidor',authMinaSidorRoutes)
app.use('/api/categories',categoryRoutes)
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hakim-livs-test/')
  .then(() => console.log('Connected to MongoDB', process.env.MONGODB_URI))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});