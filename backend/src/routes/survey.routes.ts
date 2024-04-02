import { Request, Response, Router } from "express";
import client from "../utils/client";

const surveyRoute =  Router();

const createSurvey = async(req:Request,res:Response) => {
    const {title,description,questions,authorId} = req.body
    console.log(authorId,'auth id')
    if(!title || !questions) return res.status(400).json({message:"Required parameters not found"})

    const result = await client.survey.create({
        data:{
            title,
            description,
            questions,
            authorId
        }
    })

    return res.status(201).json({message:"Survey created successfully",data:result})
}   

const getSurvey =async (req:Request,res:Response) => {
   const {surveyId} = req.body
   if(!surveyId) return res.status(400).json({message:"surveyId required"})

   const data = await client.survey.findUnique({where:{id:surveyId},
select:{
    questions :{
        select:{
            survey:true,
            options:{

            }
        }
    }
}})

   res.json({data})

} 

surveyRoute.post("/create-survey",createSurvey)
surveyRoute.get("/get",getSurvey)

export default surveyRoute