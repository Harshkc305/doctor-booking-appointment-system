const Admin=require("../models/adminModel")
const bcrypt=require("bcryptjs")
const cloudinary=require("../config/cloudunaryConfig")
const jwt=require("jsonwebtoken")
// const { generateToken, generateRefreshToken } = require("../helper/token")




class AdminController{

    // Admin Register Page
    async AdminRegisterPage(req,res){
        try{
            res.render("register",{
                title:"Admin Register Page",
            })

        }catch(error){
            console.log("Error in AdminRegisterPage",error)
        }
    }

    // Admin Register

    async AdminRegister(req,res){
        try{
            const {name,email,password}=req.body;
            const existingAdmin=await Admin.findOne({email})
            if(existingAdmin){
                console.log("Admin already exists")
                return res.redirect("/admin-register-page")
            }

            let image = "";
            let imageId = "";

            
           if (req.file){
            const uploadResult=await new Promise((resolve,reject)=>{
                cloudinary.uploader.upload_stream(
                    {folder:"admin_images"},
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
            const admin = new Admin({
                name,
                email,
                password:await bcrypt.hash(password,10),
                image:image,
                imageId:imageId
            })


            const result=await admin.save();
            if ( result ){
                console.log("Admin registered successfully")
                res.redirect("/admin-login-page")
            }else{
                console.log("Admin registration failed")
            }
        }catch(error){
            console.log("Error in AdminRegister",error)
        }
    }

    // Admin Login Page
     async AdminLoginPage(req,res){
        try{
            res.render("login",{
                title:"Admin Login Page",
            })
        }catch(error){
            console.log("Error in AdminLoginPage",error)
        }
    }

        // Admin Login
        async AdminLogin(req,res){
            try{
                const {email,password}=req.body;
                if(!email || !password){
                    return res.redirect("/admin-login-page")
                }

                const admin=await Admin.findOne({email})

                if(!admin){
                    console.log("Admin not found")
                    return res.redirect("/admin-login-page")
                }

                
                
                const isMatch=await bcrypt.compare(password,admin.password)
                if(!isMatch){
                    console.log("Incorrect password")
                    res.redirect("/admin-login-page")
                }

                const token=jwt.sign(
                    {
                        admin_id:admin._id,
                        emsil:admin.email,
                        role:admin.role
                    },
                    process.env.JWT_SECRET,
                    {expiresIn:"2h"}
                )

                // const token=generateToken(admin);
                // const refreshToken=generateRefreshToken(admin);

                if(token){
                    res.cookie("AdminToken",token);
                    return res.redirect("/admin-dashboard")
                }else{
                    console.log("Token generation failed")
                }
               
            }catch(error){
                console.log("Error in AdminLogin",error)
                res.redirect("/admin-login-page")
            }
        }

        // Admin Dashboard
            async AdminDashboard(req,res){
                try{
                    res.render("admin/adminDashboard",{
                        title:"Admin Dashboard"
                    })
                }catch(error){
                    console.log("Error in AdminDashboard",error)
                }
            }


}
module.exports=new AdminController()