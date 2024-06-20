import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
//JSON Web Tokens (JWT) are a compact, URL-safe means of representing claims to be transferred between two parties. They are often used in authentication and authorization mechanisms.
//strcture = Header,Payload,Signature
import bcrypt from "bcrypt"; // is a password hashing function designed to securely store passwords.

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

//when the data is going to saved just before that something is,done for that pre hooks are used.
// mainly made because every time we dont need to save or change password only done when modified.

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // next is called tp pass control to next middleware
  //field has been modified. If the password has not been modified, it means there's no need to hash it again.

  this.password = bcrypt.hash(this.password, 10); //bcrypt used to hash the password
  next();
});

// checks the password are coorect and return true or false
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () { // generates the access token 
  return jwt.sign(
    //generates the signed tokens
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullName,
    },
    //These lines define the payload of the JWT. The payload includes the user's _id, email, username, and fullname (from the instance properties). This information is encoded in the token.
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefrehToken = function () { // generates the refresh token
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullName,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);

//JWT is a bearer token means jo bhi yeh token bhejega usko mei sahi mna lunga works as a key for the lock.
