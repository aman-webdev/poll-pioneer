import {Router} from "express"
import userRouter from "./user.routes"
import surveyRouter from "./survey.routes"


const appRoute = Router()

appRoute.use("/user",userRouter)
appRoute.use("/survey",surveyRouter)

export default appRoute