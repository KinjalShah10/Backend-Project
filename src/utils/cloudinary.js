import {v2 as cloudinary} from "cloudinary"
//Cloudinary is a cloud-based service that provides an API for managing media assets, such as images and videos.

import fs from "fs"
//The fs module provides an API for interacting with the file system, allowing you to read, write, delete, and manipulate files and directories.

//code from cloudinary itself..........
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
    });

const uploadOnCloudinary = async (localFilePath) => {
    try {
       if (!localFilePath) return null
       //upload the file on the cloudinary


    //It uploads the file specified by localFilePath to Cloudinary.
    //"auto" specifies that Cloudinary should automatically determine the type of resource being uploaded
       const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type:"auto"
       })
       // file has been uploaded successfully
       console.log("file is uploaded on cloudinary" , response.url);
       return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temp file as the upload operation got failed.
        return null;
    }
}

export {uploadOnCloudinary}