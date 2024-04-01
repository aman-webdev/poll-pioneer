import {sign,verify} from "jsonwebtoken"
import { config } from "dotenv"

const SECRET = process.env.JWT_SECRET || 'Secret'

const TOKEN_EXPIRY = '1hr'

export const generateToken = (userId:string) => {
        return sign({userId},SECRET,{expiresIn: TOKEN_EXPIRY})
}

export const verifyToken = (token:string) => {
    try{
        const data  = verify(token,SECRET) as {userId:string}
        return data
    }catch(e:any) {
        throw new Error(e)
    }
}