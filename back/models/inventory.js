import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  quantity: { type: Number, required: true },
});

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
