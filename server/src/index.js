import dotenv from "dotenv"
import connectDB from "./db/connectDB.js"
import {httpServer } from "./app.js"

//This will make sure that all the env variable are loaded once the app is started
dotenv.config({
    path:"./.env"
})

connectDB()
.then(()=>{
    // console.log(process.env.PORT)
    httpServer.listen(process.env.PORT,()=>{
        console.log("Server is running at",process.env.PORT)
    })
})
.catch((e)=>{
    console.log("MONGODB connection error",e);
})
