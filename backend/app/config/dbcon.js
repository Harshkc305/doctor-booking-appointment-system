const mongoose= require("mongoose");

const dbconnection=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database connection successfully")
    }catch(error){
        console.log("Database connection failed",error)
    }
}
module.exports=dbconnection;
