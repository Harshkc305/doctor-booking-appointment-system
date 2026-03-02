const mongoose=require("mongoose");

const doctorSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,    
        required:true,
        // unique:true         
    },
    password:{
        type:String,
        required:true
    },
    specialization:{
        type:String,
        required:true
    },
    experience:{    
        type:Number,
        required:true
    },  
    consultationFee:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        default:""
    },
    imageId:{
        type:String,
        default:""
    },
    availableSclots:[{
        day:{
            type:String,
        },
        startTime:{
            type:String,
        },
        endTime:{
            type:String,
        }
    }],
    addedByAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"admin" 
    }
},{
    timestamps:true,
    versionKey:false
})
const doctorModel=mongoose.model("doctor",doctorSchema);
module.exports=doctorModel;