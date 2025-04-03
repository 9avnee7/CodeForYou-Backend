const mongoose=require("mongoose")

const randomStringSchema=new mongoose.Schema({
    randomString:{
        type:String
    }
});

module.exports=mongoose.model("randomString",randomStringSchema);
