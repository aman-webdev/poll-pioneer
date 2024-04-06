import {sign,verify} from "jsonwebtoken"
import { config } from "dotenv"
import bcrpyt from "bcrypt"

config()
const SECRET = process.env.JWT_SECRET || 'Secret'

const TOKEN_EXPIRY = '1h'

export const generateToken = (userId:string) => {
        return sign({userId},SECRET,{expiresIn: TOKEN_EXPIRY})
}

export const verifyToken = (token:string) => {
    try{
        console.log("in verifyToken", token,SECRET)
        const data  = verify(token,SECRET) as {userId:string}
        return data
    }catch(e:any) {
        console.log(e,'ahaha')
        throw new Error(e)
    }
}

export const hashString = async (str:string) => {
    const hash = await bcrpyt.hash(str,10)
    return hash
}

