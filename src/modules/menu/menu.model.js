import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  
  menuItemId: { type: String, required: true },  // e.g., "r1", "d2"
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

const menuSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [menuItemSchema] // each user has their own menu items
}, { timestamps: true });

menuSchema.index({ userId: 1 }, { unique: true }); // one menu per user

export default mongoose.model("Menu", menuSchema);
