const express=require("express")
const router=express.Router();
const {postOrUpdateRandomString,fetchRandomString}=require('../controllers/controller')


router.post("/postOrUpdateRandomString",postOrUpdateRandomString);


router.get("/fetchRandomString/:id",fetchRandomString);


module.exports=router;