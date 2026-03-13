const mongoose=require("mongoose");

const appointmentSchema= new mongoose.Schema({
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"doctor",
        required:true
    },
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"patient",
        required:true
    },
    appointmentDate:{
        type:Date,
        required:true
    },
    appointmentTime:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["pending","confirmed","completed","cancelled"],
        default:"pending"
    },
    paymentMode:{
        type:String,
        enum:["cash","online"],
        default:"cash"
    },
    paymentStatus:{
        type:String,
        enum:["pending","paid"],
        default:"pending"
    },
    paymentAmount:{
        type:Number,
        required:true
    }

},{
    timestamps:true,
    versionKey:false
},{
    timestamps:true,
    versionKey:false
})

const appointmentModel=mongoose.model("appointment",appointmentSchema);
module.exports=appointmentModel;