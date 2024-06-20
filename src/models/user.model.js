import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary url=aws which stores images and videos
      required: true,
    },
    coverImage: {
      type: String, //cloudinary url=aws which stores images and videos
    },
    watchHistory: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//when the data is going to saved before that something is done for that pre hooks are used.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10); //bcrypt used to hash the password
  next();
});

userSchema.methods.isPasswordCorrect = async function(password){
 return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
  return  jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    fullname:this.fullName
  },
process.env.ACCESS_TOKEN_SECRET,
{
  
  expiresIn:process.env.ACCESS_TOKEN_EXPIRY
})
}
userSchema.methods.generateRefrehToken = function(){
  return  jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    fullname:this.fullName
  },
process.env.REFRESH_TOKEN_SECRET,
{
  
  expiresIn:process.env.REFRESH_TOKEN_EXPIRY
})
}

export const User = mongoose.model("User", userSchema);

//JWT is a bearer token means jo bhi yeh token bhejega usko mei sahi mna lunga works as a key for the lock.