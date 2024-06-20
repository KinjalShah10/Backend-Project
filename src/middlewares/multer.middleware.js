import multer from "multer"; // multer is a library used as a middleware for uploading and storing the files.


//cb = call back
const storage = multer.diskStorage( // files will be stored in disk
  { 
    destination: function (req, file, cb)  // requested files callback fun
    {
      cb(null,"./public/temp")//destination whre the files being stored
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({  //creates an upload middleware using the multer function and passing the storage configuration object to it.
    storage,
})
