import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  method: { type: String, default: "Cash" },
  date: { type: Date, default: Date.now }
});

const employeeSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
    leaves: [
    {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      reason: { type: String, required: true }
    }
  ],
  name: String,
  position: String,
  contact: String,
  salary: Number,
  payments: [paymentSchema],
});

export default mongoose.model("Employee", employeeSchema);
