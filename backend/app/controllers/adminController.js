const Admin=require("../models/adminModel")
const bcrypt=require("bcryptjs")
const cloudinary=require("../config/cloudunaryConfig")
const jwt=require("jsonwebtoken")
const sendEmailVerificationOTP=require("../helper/sendEmail")
const EmailVerifyModel=require("../models/otpModel")
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
            const user = new Admin({
                name,
                email,
                password:await bcrypt.hash(password,10),
                image:image,
                imageId:imageId
            })


            const result=await user.save();

            // email send to user email
        sendEmailVerificationOTP(req,result)


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
// OTP Page

    async otpPage(req,res){
        try{
            res.render("otpPage",{
                title:"OTP Verification Page",
                user:req.user
            })
            
        }catch(error){
            console.log("Error in otpPage",error)
        }
    }

    // verify OTP
    async verifyEmail(req,res){
        try{
            const {email,otp}=req.body;
            if(!email || !otp){
                console.log("Email and OTP are required")
                return res.redirect("/admin-otp-page")
            }

            const existinguser=await Admin.findOne({email})

            if(!existinguser){
                console.log("Admin not found")
                return res.redirect("/admin-otp-page")
            }

            const emailVerification=await EmailVerifyModel.findOne({
                userId:existinguser._id,
                otp:String(otp)
            })

            if(!emailVerification){
                if(!emailVerification.is_verified){
                    await sendEmailVerificationOTP(req,existinguser)
                    console.log("Invalid OTP. A new OTP has been sent to your email.")
                }
                console.log("Invalid OTP")

            }

            // if otp is expired
            const currentTime=Date.now();
            // 15*60*1000 is 15 minutes in milliseconds
            const expirationTime=new Date(emailVerification.createdAt.getTime()+15*60*1000);
            if(currentTime>expirationTime){
                await sendEmailVerificationOTP(req,existinguser)
                console.log("OTP expired. A new OTP has been sent to your email.")
            }

            // if otp is valid and not expired
            existinguser.is_verified=true;
            await existinguser.save();

            // delete the otp from database after successful verification
            await EmailVerifyModel.deleteMany({
                userId:existinguser._id
            })
            console.log("Email verified successfully")
            res.redirect("/admin-login-page")

        }catch(error){
            console.log("Error in verifyEmail",error)
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

                const user=await Admin.findOne({email})

                if(!user){
                    console.log("Admin not found")
                    return res.redirect("/admin-login-page")
                }

                if(!user.is_verified){
                    sendEmailVerificationOTP(req,user)
                    console.log("Email not verified. Please verify your email before logging in.")
                    return res.redirect("/admin-otp-page")
                }


                
                
                const isMatch=await bcrypt.compare(password,user.password)
                if(!isMatch){
                    console.log("Incorrect password")
                    res.redirect("/admin-login-page")
                }

                const token=jwt.sign(
                    {
                        user_id:user._id,
                        email:user.email,
                        role:user.role
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
                const totalAdmins=await Admin.countDocuments();

                res.render("admin/adminDashboard",{
                    title:"Admin Dashboard",
                    totalAdmins:totalAdmins,
                    user:req.user
                })
            }catch(error){
                console.log("Error in AdminDashboard",error)
            }
        }

        // Logout
        async AdminLogout(req,res){
            try{
                res.clearCookie("AdminToken");
                res.redirect("/admin-login-page")

            }catch(error){
                console.log("Error in AdminLogout",error)
            }
        } 


}
module.exports=new AdminController()