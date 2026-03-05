require("dotenv").config();
const nodemailer=require("nodemailer")

// Email Configuration
const transpoter=nodemailer.createTransport({
    host:process.env.EMAIL_HOST||"smtp.gmail.com",
    port:process.env.EMAIL_PORT||587,
    secure:false,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

module.exports=transpoter;