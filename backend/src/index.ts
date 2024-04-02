import { config } from "dotenv"
import express from "express"
import appRoute from "./routes"

config()
const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use("/api/v1",appRoute)
app.get("/health",(_,res)=>res.send("All Good"))

app.listen(PORT,()=>console.log(`Listening on port ${PORT}`))