import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async(userId) =>
{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refersh and access token.")
    }
}

const registerUser = asyncHandler( async (req, res) => {

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
const {fullName, email, username, password } = req.body
 //console.log("email: ", email);

//2
if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
) {
    throw new ApiError(400, "All fields are required")
}

//3
const existedUser = await User.findOne({
    $or: [{ username }, { email }]
})

if (existedUser) {
    throw new ApiError(409, "User with email or username already exists")
}

//console.log(req.files);

//4
const avatarLocalPath = req.files?.avatar[0]?.path;
//const coverImageLocalPath = req.files?.coverImage[0]?.coverImage[0]?.path;

let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

if (!avatarLocalPath) {
    throw new ApiError (400, "Avatar file is required")
    
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
    username : username.toLowerCase()
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

const loginUser = asyncHandler ( async(req,res)=> {
// req data from user
// username or email
// find the user
// password check
// access and refresh token
// send cookie



//1  login user with email or username
const {email,username,password}= req.body
if (!username || !email){
    throw new ApiError(400, "Username or passowrd is required.")
}

//2
const user = await User.findOne({
    $or : [{username},{email}]
})

//3 
if (!user) {
    throw new ApiError(400,"user not exist")    
}


//4
const isPasswordValid = await user.isPasswordCorrect (password)
 if (!isPasswordValid) {
    throw new ApiError(401, "invalid user credentials ")
    
}

//5
const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

//6
const loggedInUser = await User.findById(user._id).
select("-password -refreshToken")
    
const options = {
    httpOnly: true,
    secure:true

}
return res.
status(200).
cookie("accessToken",accessToken,options).
cookie("refreshToken",refreshToken,options)
.json(
    new ApiResponse(
        200,
        {
          user:loggedInUser,accessToken,
          refreshToken  
        },
        "User logged In Successfully....."
    )
)
})

const logoutUser = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(
        req.user._id,{
            $set:{
                refreshToken : undefined
            }
        },
        {
            new:true
        }
    )
    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully."))


}) 
export {registerUser,loginUser,logoutUser}