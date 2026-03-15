const jwt=require("jsonwebtoken")
const Patisent=require("../models/patisentModel")


async function PatisentAuthCheck(req,res,next){
    try{
        const token = req.headers.authorization || req.headers.Authorization;

        if(!token){
            return res.status(400).json({
                message:"token not found"
            })
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        const user=await Patisent.findById(decoded.user_id).select("-password")

        if(!user){
            return res.status(400).json({
                message:"user not found"
            })
        }

        req.user=user;
        next()

    }catch(error){
        console.log("error to paisentauthcheck")
        return res.status(500).json({
            message:"error in patisentAuthCheck"
        })
    }

    
    
}




module.exports=PatisentAuthCheck;