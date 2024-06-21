import { response } from "express"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = asyncHandler( async(req,res) => {

// # Steps for registering user =>
// get user details from the frontend
// validation
// check if user already registered : username and email
// check for images and avtar
// upload them to cloudinary
// create user object - create entry in db
// remove password and refresh token field from response
// check for user creation
// return response

//1
const {fullName,userName,email,password}=req.body
console.log("email:", email);

//2
if(
    [fullName,email,userName,password].some((field)=> field?.trim() === ""))
    {
    throw new ApiError(400 , "All fields are required")
}

//3
const existedUser = User.findOne({
    $or : [{userName},{email}]
})

if (existedUser){
    throw new ApiError(409,"User with email or username already exist")
}

//4
const avatarLocalPath = req.files?.avtar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.coverImage[0]?.path;

if (!avatarLocalPath) {
    throw new ApiError (400, "Avtar file is required")
    
}

//5
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

if (!avatar){
    throw new ApiError (400, "Avatar file is required")  
}

//6
const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    userName : userName.toLowerCase()
})

//7
const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

if (!createdUser){
    throw new ApiError (500,"Something went wrong while registering the user")
}

return res.status(201).json(
    new ApiResponse(200 , createdUser , "User Registered Successfully")
)
})
export {registerUser}