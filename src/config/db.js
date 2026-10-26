import mongoose from "mongoose";

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);

  console.log("MongoDB Host:", conn.connection.host);
  console.log("Connected Database:", conn.connection.name);
};

export default connectDB;