const transpoter=require("../config/emailConfig")

const EmailotpModule=require("../models/otpModel")

const sendEmailVerificationOTP=async(req,user,userType)=>{
    const otp=Math.floor(100000+Math.random()*900000);
    console.log("Generated OTP:",otp)

    let otpData={
        otp:otp
    }

    if(userType==="admin"){
        otpData.userId=user.id
    }

    if(userType==="doctor"){
        otpData.doctorId=user.id
    }

    const data=await new EmailotpModule(otpData).save();

    console.log("OTP saved to database:",data)

    await transpoter.sendMail({
        from:process.env.EMAIL_USER||"harshraz0009@gmail.com",
        to:user.email,
        subject:"Email Verification OTP",
        text:`your OTP is ${otp}. Its valid for 15 minutes.`,
        html:`<b>Your OTP is ${otp}. Its valid for 15 minutes.</b>`
    })
    return otp;
}

module.exports=sendEmailVerificationOTP;