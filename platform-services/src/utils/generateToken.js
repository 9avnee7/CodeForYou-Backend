const jwt=require('jsonwebtoken')
require('dotenv').config();
const crypto=require('crypto');
const RefreshToken=require('../models/refreshToken');
const logger=require('./logger')

const generateToken=async(user)=>{
  
        const accessToken=jwt.sign({userId:user._id},process.env.JWT_SECURITY_KEY,{expiresIn:'30m'});

        // const refreshToken=crypto.randomBytes(40).toString('hex');
        // const expiresAt=new Date();
        // expiresAt.setDate(expiresAt.getDate()+7);

        const refreshToken=jwt.sign({userId:user._id},process.env.JWT_SECURITY_KEY,{expiresIn:'7d'})
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); 
        // await RefreshToken.create({
        //     token:refreshToken,
        //     user:user._id,
        //     expiresAt
        // })
        console.log(accessToken,refreshToken);
        return {accessToken,refreshToken};

 
}

module.exports={generateToken}