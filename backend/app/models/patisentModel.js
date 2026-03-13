const mongoose = require("mongoose");

const patientSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{ 
        type:String,
        required:true,
        
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
     image:{
        type:String,
        default:"" 
    },
    imgaeId:{
        type:String,
        default:""  
    },
    age:{
        type:Number,
        required:true   
    },
    gender:{
        type:String,
        enum:["Male","Female","Other"],
    },
    address:{
        type:String,
        required:true   
    }
},{
    timestamps:true,
    versionKey:false
})

const pastientModel=mongoose.model("patient",patientSchema);
module.exports=pastientModel;