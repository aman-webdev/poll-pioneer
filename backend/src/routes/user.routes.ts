import { Request, Response, Router } from "express";
import client from "../utils/client";
import { generateToken, hashString } from "../utils/auth";

const userRouter =  Router();

const signin = async(req:Request,res:Response) => {
    const {email,password} = req.body
    if( !email || !password) return res.status(400).json({message:"Required Params not found"})
    const hashedPass = await hashString(password)
    const isExists = await client.user.findUnique({where:{
        email,password:hashedPass
    }})

    if(!isExists) return res.status(409).json({message:"email / password incorrect"})



    const token = generateToken(isExists.id)

    return res.status(200).json({message:"Signin successful",data:{
        id:isExists,token
    }})

} 

const signup = async(req:Request,res:Response) => {
    const {username,email,password} = req.body
    if(!username || !email || !password) return res.status(400).json({message:"Required Params not found"})

    const isExists = await client.user.findUnique({where:{
        username:email
    }})

    if(isExists) return res.status(409).json({message:"username already exists"})

    const hashedPass =await hashString(password)

    const {id} = await client.user.create({
        data:{...req.body,password:hashedPass},
        select:{
           id:true
        }
    })

    const token = generateToken(id)

    return res.status(201).json({message:"Signup successful",data:{
        id,token
    }})
} 

userRouter.post("/signin",signin)
userRouter.post("/signup",signup)

export default userRouter