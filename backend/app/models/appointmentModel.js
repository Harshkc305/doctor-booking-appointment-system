const mongoose=require("mongoose");

const appointmentSchema= new mongoose.Schema({
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"doctor",
        // required:true
    },
    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"patient",
        // required:true
    },
    appointmentDate:{
        type:Date,
        // required:true
    },
    appointmentTime:{
        type:String,
        // required:true
    },
    paymentMode:{
        type:String,
        default:"online"
    },
    status:{
        type:String,
        enum:["pending","confirmed","completed","cancelled"],
        default:"pending"
    },
    orderId: {
        type: String,
        required: true
    },
    // Signature aur Payment ID store karna achhi practice hai
    paymentId: { type: String },
    signature: { type: String }
},{
    timestamps:true,
    versionKey:false
})

const appointmentModel=mongoose.model("appointment",appointmentSchema);
module.exports=appointmentModel;