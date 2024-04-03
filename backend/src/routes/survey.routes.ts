import { Request, Response, Router } from "express";
import client from "../utils/client";
import { Survey } from "@prisma/client";

const surveyRoute =  Router();

const createSurvey = async(req:Request,res:Response) => {
    try{
        const {title,description,questions,authorId,isAnonymous} = req.body
        if(!title || !questions) return res.status(400).json({message:"Required parameters not found"})
    
        const result = await client.survey.create({
            data:{
                title,
                description,
                questions,
                authorId,
                isAnonymous
            }
        })
    
        return res.status(201).json({message:"Survey created successfully",data:result})
    }catch(err){
        console.log("inside error")
        console.log(err)
        return res.status(500).json({message:"Something went wrong"})
    }
   
}   

const getSurvey = async (req:Request,res:Response) => {
   const {surveyId} = req.params
   if(!surveyId) return res.status(400).json({message:"surveyId required"})
   const {userId} = req

    if(!userId) {
        const survey = await client.survey.findFirst({
            where:{
                id:surveyId
            },
            select:{
                isAnonymous:true
            }
        })

        if(!survey?.isAnonymous) return res.json({message:"You are not authorized to view the survey"})
    }



   const data = await client.survey.findUnique({where:{id:surveyId},
include:{
    questions :{
        include:{
            options :{
                include: {
                    votedByUsers: {
                        
                    }
                }
            }
        }
    }
}})

   res.json({data})

} 

const getUserSurveys = async(req:Request,res:Response) => {
    const {authorId} = req.params
    const {userId} = req

    const data : {
        authorSurveys: Survey[], participatedUserSurveys:Survey[], createdUserSurveys:Survey[]
    } = {
        authorSurveys:[],participatedUserSurveys:[],createdUserSurveys:[]
    }

 

    const authorSurveys = await client.survey.findMany({
        where:{
            authorId,
            ...(!userId && {isAnonymous:true})
        }
    })

    const participatedUserSurveys = await client.survey.findMany({
        where:{
           participants:{
            some:{
                id:userId
            }
           }
        },
      
    })

    const createdSurveys = await client.survey.findMany({
        where:{
            authorId:userId
        }
    })

    data['authorSurveys'] = authorSurveys
    data['participatedUserSurveys'] = participatedUserSurveys || []
    data['createdUserSurveys'] = createdSurveys || []

    return res.json({data})
   
}

const voteInASurvey = async(req:Request, res:Response) => {
    console.log("inside vote func")
    try{
        const {questionId,optionId,userId} = req.body
        if(!questionId || !optionId) return res.status(400).json({message:"questionId and optionId are required"})
        console.log("first")
        
        const survey = await client.question.findUnique({
            where:{
                id:questionId
            },
            select : {
                survey : {
                    select:{
                        isAnonymous:true,
                        id:true
                    }
                }
            }
        })

        console.log(survey,'found')

        // const {userId} = req

        if(!userId && !survey?.survey?.isAnonymous) return res.status(401).json({message:"Not authorized"})

        if(!userId || survey?.survey?.isAnonymous) {
            await client.option.update({
                where:{
                    id:optionId, questionId
                },
                data:{
                    totalVotes:{
                        increment : 1
                    }
                }
            })

            return res.json({message:"Voted successfully"})
        }

        // if user is logged in , survey is not anonymous , find the exisiting vote by user to that option if any, remove it, update the options voted 

        const prevOptions = await client.option.findMany({
            where:{
               questionId,
               votedByUsers:{
                some:{
                    id:userId
                }
               }
            }
        })

        if(prevOptions && prevOptions.length) {
            prevOptions.forEach(async (op) =>{
                await client.option.update({
                    where:{
                        id:op.id
                    },
                    data:{
                        votedByUsers : {
                            disconnect : {
                                id: userId
                            }
                        }
                    }
                })


            await client.user.update({
                where:{
                    id: userId
                },
                data:{
                    optionsVoted : {
                        disconnect : {
                            id: op.id
                        }
                    }
                }
            })

            })


        }
        await client.option.update({
            where:{
                id:optionId
            },
            data : {
                totalVotes:{
                    increment: 1
                },
                votedByUsers:{
                    connect : {
                        id:userId
                    }
                }
            }
        })

        return res.json({message:"voted successfully"})

    }catch(err){
        console.log("inside error here")

    }
  

}

surveyRoute.post("/create-survey",createSurvey)
surveyRoute.get("/:surveyId",getSurvey)
surveyRoute.post("/vote",voteInASurvey)

export default surveyRoute