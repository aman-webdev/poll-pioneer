import { Request, Response, Router } from "express";
import client from "../utils/client";
import { Survey } from "@prisma/client";

const surveyRoute =  Router();

const createSurvey = async(req:Request,res:Response) => {
    try{
        const {title,description,questions,isAnonymous} = req.body
        const {userId} = req
        if(!userId) return res.sendStatus(401)
        if(!title || !questions) return res.status(400).json({message:"Required parameters not found"})
    
        const result = await client.survey.create({
            data:{
                title,
                description,
                questions:{
                    create: questions.map((ques:any)=>{
                      return  { ...ques, options:{
                        create : ques.options
                      }}

                    })
                },
                authorId:userId,
                isAnonymous
            },
        
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

const getSurveysForUser = async(req:Request,res:Response) => {
    const {authorId} = req.params
    const {userId} = req

    const data : {
        authorSurveys: Survey[], participatedUserSurveys:Survey[], createdUserSurveys:Survey[]
    } = {
        authorSurveys:[],participatedUserSurveys:[],createdUserSurveys:[]
    }
    const anonymousSurveys = await client.survey.findMany({
        where:{
            isAnonymous:true
        }
    })

    const authorSurveys = await client.survey.findMany({
        where:{
            ...(authorId && {authorId}),
            ...(!userId && {isAnonymous:true})
        }
    })

    if(!userId) return res.json({data:{authorSurveys,anonymousSurveys}})

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

    data['participatedUserSurveys'] = participatedUserSurveys || []
    data['createdUserSurveys'] = createdSurveys || []

    return res.json({data:{
        ...data, anonymousSurveys
    }})
   
}

const voteInASurvey = async(req:Request, res:Response) => {
    console.log("inside vote func",req.userId)
    try{
        const {questionId,optionId} = req.body
        if(!questionId || !optionId) return res.status(400).json({message:"questionId and optionId are required"})
        const {userId} = req
        
        const survey = await client.question.findUnique({
            where:{
                id:questionId
            },
            select : {
                survey : {
                   
                    include:{
                        participants:{
                                select:{
                                    id:true
                                }
                        }
                    }
                }
            }
        })

        console.log(survey)

        // const {userId} = req
        console.log(!userId && !survey?.survey?.isAnonymous)

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

        const queries:any = [] 

        if(prevOptions && prevOptions.length) {
            prevOptions.forEach( (op) =>{
                queries.push(client.option.update({
                    where:{
                        id:op.id
                    },
                    data:{
                        votedByUsers : {
                            disconnect : {
                                id: userId
                            }
                        },
                        totalVotes:{
                            decrement:1
                        }
                    }
                }))


             queries.push(client.user.update({
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
            }))

            })


        }
         queries.push(client.option.update({
            where:{
                id:optionId
            },
            data : {
                totalVotes:{
                    increment: 1
                },
                votedByUsers:{
                    connect : {
                        id:userId,
                        
                    },
                    
                }
            }
        }))

       console.log("prev op",prevOptions)
        if(survey && !prevOptions?.length) {
            console.log("inside if here")
            queries.push(client.user.update({
                where:{
                    id:userId,
    
                },
                data:{
                    participatedSurveys:{
                        connect:{
                            id:survey?.survey.id,
                            
                        }
                        
                    }
                },
              
            }))
    
           
            queries.push(client.survey.update({
                where:{
                    id:survey.survey.id,
                },
                data:{
                    totalParticipants:{
                        increment:1
                    }
                }
            }))
        }
      

        

       

        await client.$transaction(queries)



        return res.json({message:"voted successfully"})

    }catch(err){
        console.log("inside error here",err)

    }
  

}

const deleteSurvey = async(req:Request, res:Response) => {
    try{
        const {surveyId} = req.body
        const {userId} = req
        if(!userId) return res.sendStatus(401)

        await client.survey.delete({
            where:{
                authorId:userId,
                id:surveyId
            },
           
            

        })

        return res.json({message:"Deleted Successfully"})
    }
    catch(err){
        console.log("errrrr",err)
    }
}

surveyRoute.post("/",createSurvey)
surveyRoute.get("/by-user",getSurveysForUser)
surveyRoute.get("/:surveyId",getSurvey)
surveyRoute.post("/vote",voteInASurvey)
surveyRoute.delete("/",deleteSurvey)

export default surveyRoute