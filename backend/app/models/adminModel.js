const mongoose = require("mongoose");

const adminSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user" 
    },
    is_verified:{
        type:Boolean,
        default:false
    },
    image:{
        type:String,
        default:""
    },
    imageId:{
        type:String,
        default:""
    },
    refreshToken: {
        type: String,
        default: ""
    }
},{
    timestamps:true,
    versionKey:false
})
const adminModel=mongoose.model("admin",adminSchema);
module.exports=adminModel;
