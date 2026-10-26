import mongoose from "mongoose";


const tokenSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
     type: String,
      required: true
     },
  tokenNumber: { 
    type: Number, 
    required: true 
  },
  items: [
    { 
      name: String,
     qty: Number,
      price: Number 
    }
    ],
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online"],
      required: false
    },
  tableNumber: {
    type: Number,
    required: true
  },
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now },
   status: { type: String, enum: ["active", "completed", "cancelled"] },
  hotelName: {
    type: String,
    required: true
  }
});

// Ensure uniqueness per admin/day/tokenNumber
tokenSchema.index({ adminId: 1, date: 1, tokenNumber: 1 }, { unique: true });

export default mongoose.model("Token", tokenSchema);

