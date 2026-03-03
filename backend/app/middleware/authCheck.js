const jwt=require("jsonwebtoken");
const Admin=require("../models/adminModel");

async function AuthCheck(req,res,next){
    try{
        const token=req.cookies.AdminToken;

        if(!token){
            return res.redirect("/admin-login-page")
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        const admin=await Admin.findById(decoded.admin_id).select("-password")

        if(!admin){
                return res.redirect("/admin-login-page")
        }
        req.admin=admin;
        next();

    }catch(error){
        console.log("Error in AuthCheck",error)
        return res.redirect("/admin-login-page")
    }
}
module.exports=AuthCheck;
