import { DB_NAME } from '../utils/constants.js'
import mongoose from "mongoose"

const connectDB=async()=>{
    console.log("MONgodb uri",process.env.MONGODB_URI," DB Name",DB_NAME)
    try {
       const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log("\n Monogo DB connected!! DB Host:",connectionInstance.connection.host)
    } catch (error) {
        console.log("MongoDB connection error",error)
        process.exit(1)
    }
}
export default connectDB