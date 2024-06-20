import mongoose from "mongoose"

const connectDB = async () => {
  try {
    const options = {
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    }
    const conn = await mongoose.connect(process.env.MONGODB_URL,options);
    console.log(`Conneted To Mongodb Databse ${conn.connection.host}`)
  } catch (error) {
    console.log(`Error in Mongodb ${error}`);
  }
};

export default connectDB;