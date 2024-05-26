import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"


function capitalizeFirstLetter(string) {
    return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        // console.log("Access key", process.env.ACCESS_TOKEN_SECRET_KEY)
        const accessToken = await user.generateAccessToken()
        // console.log("AccessToken",accessToken)
        // console.log("Access key", process.env.REFRESH_TOKEN_SECRET_KEY)
        const refreshToken = await user.generateRefreshToken()
        // console.log("Refresh Token",refreshToken)


        //we are storing refresh token in database only for logged-in users not for the new registered ones
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }) //validateBeforeSave is set to false because we are not validating the password while saving the refresh token
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens", error)
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const { fullName, email, password, role, contactNo } = req.body

    console.log("password ", password)
    if ([fullName, email, password, role, contactNo].some((feild) => feild?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({ email: email })
    if (existedUser) {
        throw new ApiError(409, "User with email already exists")
    }

    const avatarLocalPath = req.file?.path;
    console.log(req.file)
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed")
    }

    const user = await User.create(
        {
            fullName: capitalizeFirstLetter(fullName.trim()),
            avatar: avatar.url || " ",
            email,
            password,
            role,
            contactNo
        }
    )

    const createdUser = await User.findById(user._id).select(
        "-password " //This means we are not sending the password and refreshToken to the frontend
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(createdUser._id)

    const options = {
        httpOnly: true, //This means that the cookie can only be accessed by the server
        secure: false //This means a cookie can only be accessed by the server if the request is being sent over HTTPS
        //TODO: For production set it to true
    }


    createdUser.accessToken = accessToken;
    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, { data: {user: createdUser,accessToken} }, "User Registered Successfully")
        )
})

const loginUser = asyncHandler(async (req, res) => {

    const { email, password,role } = req.body
    if (!email) {
        throw new ApiError(400, "Email or Username is required")
    }
    const user = await User.findOne({ email: email });
    if(role=="admin" && user.role!="admin"){
        throw new ApiError(400,"You Registered as user cannot be logged in as admin")
    }
    if(role=="user" && user.role!="user"){
        throw new ApiError(400,"You Registered as Admin cannot be logged in as user")
    }
    if (!user) {
        throw new ApiError(404, "User Does not Exists")
    }
    console.log("Password ",password)
    const isPasswordValid = await user.isPasswordCorrect(password)
    console.log("isPasswordValid ",isPasswordValid)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user Credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password ")

    const options = {
        httpOnly: true, //This means that the cookie can only be accessed by the server
        secure: false //This means a cookie can only be accessed by the server if the request is being sent over HTTPS
        //TODO: For production set it to true
    }
    console.log("Access token", accessToken)
    loggedInUser.accessToken = accessToken;
    console.log(loggedInUser)
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            { data: {user: loggedInUser,accessToken} },
            "User Logged In Successfully"
        ))

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $unset: {
                refreshToken: 1 //This is used to remove the refresh token from the database
            },

        },
        {
            new: true //This is to get the updated instance of the user(refreshToken = undefined) rather then old where there is a refresh token value
        })
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User logged Out"))
})



const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    console.log("Refresh Token later", req.body.refreshToken)
    if (!incomingRefreshToken || incomingRefreshToken === "null") {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET_KEY
        )

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is Expired or used")
        }
        const options = {
            httpOnly: true,
            secure: true,
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
        user.refreshToken = refreshToken
        user.save()

        const resUser = await User.findById(req.user._id)
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { data: resUser, accessToken }, "Access Token Refreshed"))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")
    }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id)
    // console.log("User ",user)
    // console.log("Old password is:  ",oldPassword,"\nNew Password is : ",newPassword);
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid Password")
    }
    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    return res.status(200).json(new ApiResponse(
        200,
        {},
        "Password Updated Successfully"
    ))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched Successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body
    // console.log("fullName", fullName, "email", email)
    if (!fullName && !email) {
        throw new ApiError(400, "All feilds are required")
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: { fullName, email: email }
    }, { new: true }).select("-password") //This option, when set to true, instructs Mongoose to return the modified document rather than the original one. 

    console.log("Successfull")
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            user,
            "Account Details Updated Successfully"
        ))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const localAvatarPath = req.file?.path
    //TODO: Delete the old avatar from cloudinary
    if (!localAvatarPath) {
        throw new ApiError(400, "Avatar file is missing")
    }
    const avatar = await uploadOnCloudinary(localAvatarPath)
    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            avatar: avatar.url
        }
    }, { new: true }).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "Avatar Successfully Updated"))
})

const googleAuth = asyncHandler(async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (user) {
            const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
            return res.status(200).json(new ApiResponse(200, { user: user }, "User Logged In Successfully"))
        }
        const newUser = await User.create({
            fullName: capitalizeFirstLetter(req.body.fullName),
            email: req.body.email,
            avatar: req.body.avatar,
            fromGoogle: true
        })
        const savedUser = await newUser.save()
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(savedUser._id)
        return res.status(201).json(new ApiResponse(201, { user: savedUser, accessToken, refreshToken }, "User Registered Successfully"))
    } catch (error) {
        throw new ApiError(500, "Something went wrong while logging in with google")
    }
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    googleAuth
}