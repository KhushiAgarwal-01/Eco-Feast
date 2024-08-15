import express from 'express';
import Store from '../models/store.js';
const router = express.Router();




// Get all stores
router.get("/", async (req, res) => {
  const { search, type, maxDistance, lat, lon } = req.query;

  let query = {};
  if (search) {
    query.$or = [
      { name: new RegExp(search, "i") },
      { address: new RegExp(search, "i") },
    ];
  }
  if (type) {
    query.type = type;
  }

  try {
    const stores = await Store.find(query);
    if (maxDistance && lat && lon) {
      const filteredStores = stores.filter((store) => {
        const distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lon),
          store.latitude,
          store.longitude
        );
        return distance <= parseFloat(maxDistance);
      });
      return res.json(filteredStores);
    }
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: "Error fetching stores" });
  }
});

// Create a new store
router.post("/", async (req, res) => {
  const { name, address, type, latitude, longitude } = req.body;
  try {
    const newStore = new Store({ name, address, type, latitude, longitude });
    await newStore.save();
    res.status(201).json(newStore);
  } catch (error) {
    res.status(500).json({ error: "Error creating store" });
  }
});

export default router;
