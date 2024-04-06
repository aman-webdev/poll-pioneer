import { config } from "dotenv"
import express, { NextFunction, Request, Response } from "express"
import appRoute from "./routes"

config()
const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use("/api/v1",appRoute)
app.get("/health",(_,res)=>res.send("All Good"))


app.use((err:any,req:Request,res:Response,next:NextFunction)=>{
    console.log("in error func")
    return res.status(500).json({message: err.message || "Something went wrong"})
})
app.listen(PORT,()=>console.log(`Listening on port ${PORT}`))