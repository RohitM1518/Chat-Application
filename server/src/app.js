import  express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"


const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your front-end origin
    credentials: true, // Allow requests with credentials (e.g., cookies, auth tokens)
}));

//use method used whenever we use middleware, configuration
app.use(express.json({
    limit:"16kb"
}
))//This means I am accepting the json data to store the data in DB
app.use(express.urlencoded({extended:true,limit:"16kb"}))//This means I am accepting the url encoded with data to store the data in DB
app.use(express.static("public"))//This is to store some data which can be accessed by anyone such as pdf,photo
//public folder is already created so we are passing public
app.use(cookieParser())


//import routes
import userRoutes from './routes/user.route.js'

app.use('/user',userRoutes)

export {app}