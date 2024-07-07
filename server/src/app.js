import  express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import { initializeSocketIO } from "./socket/index.js";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
console.log("Hello ",process.env.CORS_ORIGIN)
// Assuming your front-end is running on a different port like 3000
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Allow requests from your front-end origin
    credentials: true, // Allow requests with credentials (e.g., cookies, auth tokens)
}));
app.set("io",io)
//use method used whenever we use middleware, configuration
app.use(express.json({
    limit:"16kb"
}
))//This means I am accepting the json data to store the data in DB
app.use(express.urlencoded({extended:true,limit:"16kb"}))//This means I am accepting the url encoded with data to store the data in DB
app.use(express.static("public/images"))//This is to store some data which can be accessed by anyone such as pdf,photo
//public folder is already created so we are passing public
app.use(cookieParser())


//import routes
import userRoutes from './routes/user.route.js'
import messageRoutes from './routes/message.route.js'
import chatRoutes from './routes/chat.route.js'

app.use('/user',userRoutes)
app.use('/message',messageRoutes)
app.use('/chat',chatRoutes)

initializeSocketIO(io);

export {app,httpServer,io}