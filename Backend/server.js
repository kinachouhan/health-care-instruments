import express from "express"
import dotenv from "dotenv"
dotenv.config()
import {dbConnect} from "./DbConfig/dbConnect.js"
import userRoute from "./Routes/userRoute.js"
import cors from "cors"
import cookieParser from "cookie-parser"



const app = express()
const PORT = process.env.PORT || 3200
dbConnect()


app.use(cookieParser());
app.use(express.json())
app.use(cors({ origin: "http://localhost:5173", credentials: true }));




app.use("/api/v1/user" , userRoute)

app.listen(PORT , ()=>{
     console.log(`Server is listening on ${PORT} port.`)
})