import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/auth";

declare module 'express' {
    interface Request {
        userId?: string;
    }
}
const authMiddleware = async(req:Request,res:Response,next:NextFunction) => {
    try{
        const authToken = req.headers['authorization']
        const token = authToken?.split("Bearer ").pop()
        if(!token)
        return res.status(401).json({message:"Unauthorized"})

        const {userId} = verifyToken(token)
        if(!userId) return res.status(401).json({message:"Unauthorized"})
        req.userId = userId
        next()


    }catch(e:any){
        return res.status(e.status || 500).json({message:e.message || "Something went wrong"})
    }
           
}

export default authMiddleware