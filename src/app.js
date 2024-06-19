import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"})) //json files (form)
app.use(express.urlencoded({extended : true, limit:"16kb"})) //url data
app.use(express.static("public")) //files and folders access
app.use(cookieParser()) //accept and send cookies









export default app