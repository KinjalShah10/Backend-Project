import express from "express"
import cors from "cors"
//Cross-Origin Resource Sharing) is a middleware for Express that enables cross-origin requests. It allows specifying which domains can access resources on your server.
import cookieParser from "cookie-parser"
//cookie-parser is a middleware for Express that parses cookies attached to the client request object and populates req.cookies with an object keyed by the cookie names.

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))


// one type of middlewares
app.use(express.json({limit:"16kb"})) //json files (form)
app.use(express.urlencoded({extended : true, limit:"16kb"})) //url data
app.use(express.static("public")) //files and folders access
app.use(cookieParser()) //accept and send cookies









export default app