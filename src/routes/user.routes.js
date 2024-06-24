import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()


//register user ke jusrt pehle humne middle ware use karliya by upload given by multer.
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount:1,
        },
        {
            name: "coverImage",
            maxCount : 1,
        }
    ]),
    registerUser)

export default router