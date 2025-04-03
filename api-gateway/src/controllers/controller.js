
const randomString=require('../models/gfgString')


const postOrUpdateRandomString=async(req,res)=>{

    try{
        const {stringId,stringToPost}=req.body;

        const fetchedString=await randomString.findById(stringId);

        if(fetchedString){
            const updateString=await randomString.findByIdAndUpdate(stringId,
                {$set:{randomString:stringToPost}},{new:true}
            )
            
            return res.status(200).json({
                data:updateString,
                message:"random String updated"
            })
            
         }
        
         const addString=await randomString.create({
            randomString:stringToPost
         })

         return res.status(200).json({
            data:addString,
            message:"random String stored"
        })


   
}
catch(e){
    console.log(e);
    return res.status(500).json({
        message:"random String internal server error on posting"
    })
}
}

const fetchRandomString=async(req,res)=>{

    try{
        const stringId=req.params.id;

        const fetchedString=await randomString.findById(stringId);

        if(fetchedString){
           
            return res.status(200).json({
                data:fetchedString,
                message:"random String fetched"
            })

         }
    
    
         return res.status(200).json({
            data:fetchedString,
            message:"random String not found"
        })
 
}
catch(e){
    console.log(e)
    return res.status(500).json({
        message:"random String internal server error onn fetching"
    })
}
}

module.exports={postOrUpdateRandomString,fetchRandomString}