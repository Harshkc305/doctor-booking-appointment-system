const mongoose=require("mongoose");
const specializationSchema= new mongoose.Schema({
    name:{
        type:String,    
        required:true,
        
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,
    versionKey:false
})
const specializationModel=mongoose.model("specialization",specializationSchema);
module.exports=specializationModel;