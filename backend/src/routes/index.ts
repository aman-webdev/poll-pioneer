import {NextFunction, Router} from "express"
import userRouter from "./user.routes"
import surveyRouter from "./survey.routes"
import authMiddleware from "../middlewares/auth.middleware"


const appRoute = Router()
appRoute.use(authMiddleware)

appRoute.use("/user",userRouter)
appRoute.use("/survey",surveyRouter)


export default appRoute