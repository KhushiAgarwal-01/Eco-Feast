
import express from 'express';
import Inventory from '../models/inventory.js';


const router = express.Router();

// Get inventory for a product at a specific store
router.get("/:productId/:storeId", async (req, res) => {
  const { productId, storeId } = req.params;
  try {
    const inventory = await Inventory.findOne({ productId, storeId });
    res.json(inventory || { quantity: 0 });
  } catch (error) {
    res.status(500).json({ error: "Error fetching inventory" });
  }
});

// Create or update inventory
router.post("/", async (req, res) => {
  const { productId, storeId, quantity } = req.body;
  try {
    const inventory = await Inventory.findOneAndUpdate(
      { productId, storeId },
      { quantity },
      { new: true, upsert: true }
    );
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ error: "Error updating inventory" });
  }
});

export default router;
