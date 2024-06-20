import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

//connection of DB needs time so we need to use asyn await function.
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        // this wil show that we have succefully connected to our company server only displaying the host also.
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1) //process.exit(1) is called to terminate the Node.js process with a non-zero exit code, indicating that an error occurred.
    }
}

export default connectDB;