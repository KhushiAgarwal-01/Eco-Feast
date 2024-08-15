import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  type: {
    type: String,
    enum: ["supercenter", "neighborhood market"],
    required: true,
  },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const Store = mongoose.model("Store", storeSchema);

    
export default Store;
    
