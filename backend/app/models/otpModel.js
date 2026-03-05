const mongoose=require("mongoose")

const emailOtpSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"admin",
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:"15m"
    }
},{
    timestamps:true,
    versionKey:false
})
const EmailotpModel=mongoose.model("Otp",emailOtpSchema)

module.exports=EmailotpModel;


