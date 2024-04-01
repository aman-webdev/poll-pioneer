import { Request, Response, Router } from "express";

const surveyRoute =  Router();

const signin = (req:Request,res:Response) => {

} 

const signup = (req:Request,res:Response) => {
    
} 

surveyRoute.post("/signin",signin)
surveyRoute.post("/signin",signup)

export default surveyRoute