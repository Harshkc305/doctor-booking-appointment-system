const jwt=require("jsonwebtoken")
const Doctor=require("../models/doctorModel")


async function DoctorAuthCheck(req,res,next){
    try{
        const token=req.cookies.DoctoToken;

        if(!token){
            return res.redirect("/doctor-login-page")
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        
        const user=await Doctor.findById(decoded.doctorId).select("-password")
        if(!user){
            return res.redirect("/doctor-login-page")
        }
        req.user=user;
        next()

    }catch(error){
        console.log("error in DoctorAuthCheck",error)
        return res.redirect("/doctor-login-page")
    }
}
module.exports=DoctorAuthCheck;