const express = require('express');
const logger = require('../utils/logger');
const platform = require('../models/gfg');
const GFG =require('../models/gfg')
const leetcode=require('../models/leetcode');
// const platform = require('../models/platform');
const { log } = require('winston');
const codingninjas = require('../models/codingninjas');
const codeforces = require('../models/codeforces');


// posting data from platform api to the databases
// posting data from platform api to the databases
// posting data from platform api to the databases
// posting data from platform api to the databases
// posting data from platform api to the databases
// posting data from platform api to the databases
// posting data from platform api to the databases
// posting data from platform api to the databases
// posting data from platform api to the databases

const postcodeforcesDataToDB = async (req, res) => {
    logger.info('Fetching and saving codeforces data to DB endpoint hit');
    try {
        const { username, codeforcesDetails } = req.body;

        if(!req.body){
            res.status(400).json({
                data:"data required codeforces"
            })
        }
        const dataToPost=codeforcesDetails;

        console.log("Received codeforces platformDetails:", dataToPost);

        const userExist = await codeforces.findOne({ username });

        if (userExist) {
  
            const updatedDetails = await codeforces.findByIdAndUpdate(
                userExist._id,
                { $set: dataToPost },
                { new: true } 
            );

            return res.status(200).json({
                message: "User details updated successfully",
                data: updatedDetails
            });
        }
        const codeforcesData = new codeforces(dataToPost);

        await codeforcesData.save();

        return res.status(200).json({
            message: "Data fetched and saved successfully",
            data: codeforcesData
        });
    } catch (e) {
        logger.error("Error occurred in fetching and saving the gfg data", e);
        return res.status(500).json({
            message: `Error Occurred: ${e.message}`
        });
    }
};






const postGFGDataToDB = async (req, res) => {
    logger.info('Fetching and saving GFG data to DB endpoint hit');
    try {
        const { username, GFGDetails } = req.body;

        if(!req.body){
            res.status(400).json({
                data:"data required"
            })
        }
        const dataToPost=GFGDetails;

        console.log("Received platformDetails:", dataToPost);

        const userExist = await GFG.findOne({ username });

        if (userExist) {
  
            const updatedDetails = await GFG.findByIdAndUpdate(
                userExist._id,
                { $set: dataToPost },
                { new: true } 
            );

            return res.status(200).json({
                message: "User details updated successfully",
                data: updatedDetails
            });
        }
        const GFGData = new GFG(dataToPost);

        await GFGData.save();

        return res.status(200).json({
            message: "Data fetched and saved successfully",
            data: GFGData
        });
    } catch (e) {
        logger.error("Error occurred in fetching and saving the gfg data", e);
        return res.status(500).json({
            message: `Error Occurred: ${e.message}`
        });
    }
};






const postLeetcodeDataToDB = async (req, res) => {
    logger.info('Fetching and saving leetcode data to DB endpoint hit');
    try {
        const { username,leetcodeDetails} = req.body;
        console.log('username here',username)

        if(!req.body){
            res.status(400).json({
                data:"data required"
            })
        }
        const dataToPost={...leetcodeDetails,username};
        

        console.log("Received platformDetails:", dataToPost.username);

        const userExist = await leetcode.findOne({ username });

        if (userExist) {
            console.log("user exixr",userExist)
            const updatedDetails = await leetcode.findByIdAndUpdate(
                userExist._id,
                { $set: dataToPost },
                { new: true } 
            );
            return res.status(200).json({
                message: "User details updated successfully",
                data: updatedDetails
            });
        }
        const leetcodeData = new leetcode(dataToPost);
        console.log('username here before ',dataToPost)
        try{
        await leetcodeData.save();
        return res.status(200).json({
            message: "Data fetched and saved successfully",
            data: leetcodeData
        });
        }
        catch(e){
            console.log(e);
            console.log('not a valid data');
            return res.status(400).json({
                message: "Data fetched but error in saving successfully",
                data: leetcodeData
            });
        }
        
    } catch (e) {
        logger.error("Error occurred in fetching and saving the leetcode data", e);
        console.log(e)
        return res.status(500).json({
            message: `Error Occurred: ${e.message}`
        });
    }
};



const postCodingNinjasDataToDB = async (req, res) => {
    logger.info('Fetching and saving coding ninjas data to DB endpoint hit');
    try {
        const { username,dataToPost} = req.body;

        if(!req.body){
            res.status(400).json({
                data:"data required"
            })
        }
        console.log("Received platformDetails:", dataToPost);

        const userExist = await codingninjas.findOne({ username });

        if (userExist) {
  
            const updatedDetails = await codingninjas.findByIdAndUpdate(
                userExist._id,
                { $set: dataToPost },
                { new: true } 
            );

            return res.status(200).json({
                message: "User details updated successfully",
                data: updatedDetails
            });
        }
        const codingNinjaData = new codingninjas(dataToPost);

        await codingNinjaData.save();

        return res.status(200).json({
            message: "Data fetched and saved successfully",
            data: codingNinjaData
        });
    } catch (e) {
        logger.error("Error occurred in fetching and saving the leetcode data", e);
        return res.status(500).json({
            message: `Error Occurred: ${e.message}`
        });
    }
};






// fetching data from DB to DASHBOARD
// fetching data from DB to DASHBOARD
// fetching data from DB to DASHBOARD
// fetching data from DB to DASHBOARD
// fetching data from DB to DASHBOARD
// fetching data from DB to DASHBOARD
// fetching data from DB to DASHBOARD


const fetchLeetcodeDataFromDB=async(req,res)=>{
    logger.info("fetchDataFromDB endpoint hit");
    try{
    
        console.log(typeof(req.params.id));
        console.log(req.params.id)
        const userData=await leetcode.findOne({username:req.params.id});

        if(!userData){
            return res.status(400).json({
                message:"userdata does not exist"
            })
        }

        return res.status(200).json({
            data:userData
        })
    }
    catch(e){
        logger.error("Error occurred in fetching data from  Leetcode database", e);
        return res.status(500).json({
            message: `Error Occurred: ${e}`
        });
    }
}
const fetchCodeforcesDataFromDB=async(req,res)=>{
    logger.info("fetchDataFromDB endpoint hit");
    try{
    
        console.log(typeof(req.params.id));
        console.log(req.params.id)
        const userData=await codeforces.findOne({username:req.params.id});

        if(!userData){
            return res.status(400).json({
                message:"userdata does not exist codeforces"
            })
        }

        return res.status(200).json({
            data:userData
        })
    }
    catch(e){
        logger.error("Error occurred in fetching data from  codeforcces database", e);
        return res.status(500).json({
            message: `Error Occurred: ${e}`
        });
    }
}

const fetchGFGDataFromDB=async(req,res)=>{
    logger.info("fetchDataFromDB endpoint hit");
    try{
    
        console.log(typeof(req.params.id));
        console.log(req.params.id)
        const userData=await GFG.findOne({username:req.params.id});

        if(!userData){
            return res.status(400).json({
                message:"userdata does not exist"
            })
        }

        return res.status(200).json({
            data:userData
        })
    }
    catch(e){
        logger.error("Error occurred in fetching data from  coding ninjas database", e);
        return res.status(500).json({
            message: `Error Occurred: ${e}`
        });
    }
}


const fetchCodingNinjaseDataFromDB=async(req,res)=>{
    logger.info("fetchDataFromDB endpoint hit");
    try{
    
        console.log(typeof(req.params.id));
        console.log(req.params.id)
        const userData=await codingninjas.findOne({username:req.params.id});

        if(!userData){
            return res.status(400).json({
                message:"userdata does not exist"
            })
        }

        return res.status(200).json({
            data:userData
        })
    }
    catch(e){
        logger.error("Error occurred in fetching data from  coding ninjas database", e);
        return res.status(500).json({
            message: `Error Occurred: ${e}`
        });
    }
}

module.exports = { postGFGDataToDB ,postLeetcodeDataToDB,fetchCodeforcesDataFromDB,fetchLeetcodeDataFromDB,fetchGFGDataFromDB,postCodingNinjasDataToDB,fetchCodingNinjaseDataFromDB,postcodeforcesDataToDB};
