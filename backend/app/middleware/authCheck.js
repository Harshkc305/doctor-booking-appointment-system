const jwt=require("jsonwebtoken");
const Admin=require("../models/adminModel");

async function AuthCheck(req,res,next){
    try{
        const token=req.cookies.AdminToken;

        if(!token){
            return res.redirect("/admin-login-page")
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        const user=await Admin.findById(decoded.user_id).select("-password")

        if(!user){
                return res.redirect("/admin-login-page")
        }
        req.user=user;
        next();

    }catch(error){
        console.log("Error in AuthCheck",error)
        return res.redirect("/admin-login-page")
    }
}
module.exports=AuthCheck;
