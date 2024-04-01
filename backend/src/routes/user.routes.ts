import { Request, Response, Router } from "express";

const userRouter =  Router();

const signin = (req:Request,res:Response) => {

} 

const signup = (req:Request,res:Response) => {
    
} 

userRouter.post("/signin",signin)
userRouter.post("/signin",signup)

export default userRouter