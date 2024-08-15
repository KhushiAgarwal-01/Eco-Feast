
import express from 'express';
import productRoutes from './routes/ProductRoutes.js';
import storeRoutes from './routes/StoreRoutes.js';
import inventoryRoutes from './routes/InventoryRoutes.js';
import authRouter from './routes/auth.router.js';

const app = express();

import mongoose from "mongoose";



const uri = "mongodb+srv://prasoon:prasoon@prasoon.qng671w.mongodb.net/";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Middleware
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use('/api/auth',authRouter)

app.use((err,req,res,next)=>{
  const statusCode=err.statusCode||500;
  const message=err.message ||'Internal server error';
  return res.status(statusCode).json({
      success:false,
      statusCode,
      message,
  })
  })

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
