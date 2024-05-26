import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        
        //  console.log("This is req.cookies",req.cookies)
        //  console.log("This is token",req.header("Authorization")?.replace("Bearer ", "") )
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") 
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        //Here we decoding the token to get the id from the function 
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        // console.log("This is decoded token",decodedToken)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        //below we are adding new object named user and assigning the user
        req.user=user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message|| "Invalid Access Token")
    }
})