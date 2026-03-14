const Patisent=require("../models/patisentModel")

const cloudinary=require("../config/cloudunaryConfig")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


class ApiPatisentController{

    async patisentRegister(req,res){
        try{
            const {name,email,phone,password,gender,address,age}=req.body;
            
            const existingPatisent=await Patisent.findOne({email})
            if(existingPatisent){
                console.log("patisent already exjist")
                return res.status(400).json({
                message: "Patient already exists"
            })
            }

            let image="";
            let imageId="";

            if(req.file){
                const uploadResult=await new Promise((resolve,reject)=>{
                    cloudinary.uploader.upload_stream(
                        {folder:"patisent_image"},
                        (error,result)=>{
                            if(error){
                                reject(error)
                            }else{
                                resolve(result)
                            }
                        }
                    ).end(req.file.buffer)
                })
                image=uploadResult.secure_url;
                imageId=uploadResult.public_id;
            }

            const user=new Patisent({
                name,
                email,
                phone,
                password:await bcrypt.hash(password,10),
                image,
                imageId,
                address,
                gender,
                age
            })

            const result=await user.save();

            return res.status(200).json({
                message:"patisent data save successfully",
                data:result
            })

        }catch(error){
            console.log("error to register paisent",error)
            return res.status(500).json({
                message:"internal server error"
            })
        }
    }

    async PatisentLogin(req,res){
        try{
            const {email,password}=req.body;

            if(!email ||!password){
                return res.status(400).json({
                    message:"all field is required"
                })
            }

            const user=await Patisent.findOne({email})
            if(!user){
                return res.status(400).json({
                    message:"user not found"
                })
            }

            const isMatch=await bcrypt.compare(password,user.password)
            if(!isMatch){
                return res.status(400).json({
                    message:"incoreect password"
                })
            }
            const token=jwt.sign(
                {
                    user_id:user._id,
                    name:user.name,
                    email:user.email,
                    image:user.image
                },
                process.env.JWT_SECRET,
                {expiresIn:"2h"}
            )

            return res.status(200).json({
                message:"login successfully",
                token:token,
                user:{
                    _id:user._id,
                    name:user.name,
                    email:user.email,
                    image:user.image
                }
            })


            

        }catch(error){
            console.log(error,"error to get patisent login")
            return res.status(500).json({
                message:"internal server error"
            })
        }
    }

    

    async dashboardp(req,res){
    try{
        return res.status(200).json({
            message:"welcome to dashboard"
        })
    }catch(error){
        return res.status(500).json({
            message:"internal server error"
        })
    }
}
}
module.exports= new ApiPatisentController()