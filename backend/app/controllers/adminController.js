const Admin=require("../models/adminModel")
const Doctor=require("../models/doctorModel")

const bcrypt=require("bcryptjs")
const cloudinary=require("../config/cloudunaryConfig")
const jwt=require("jsonwebtoken")
const sendEmailVerificationOTP=require("../helper/sendEmail")
const EmailVerifyModel=require("../models/otpModel")
const sendDoctorCredentials=require("../helper/sendDoctorCredential")
const transporter= require("../config/emailConfig")
// const { generateToken, generateRefreshToken } = require("../helper/token")

const Specialization=require("../models/specialization")


class AdminController{

    // Admin Register Page
    async AdminRegisterPage(req,res){
        try{
            res.render("admin/register",{
                title:"Admin Register Page",
                user:req.user
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
        sendEmailVerificationOTP(req,result,"admin")


            if ( result ){
                console.log("Admin registered successfully")
                res.redirect("/admin-otp-page")
            }else{
                console.log("Admin registration failed")
            }
        }catch(error){
            console.log("Error in AdminRegister",error)
        }
    }
// OTP Page---------------------

    async otpPage(req,res){
        try{
            res.render("admin/otpPage",{
                title:"OTP Verification Page",
                user:req.user
            })
            
        }catch(error){
            console.log("Error in otpPage",error)
        }
    }

    // verify OTP -----------------------------
    async verifyEmail(req,res){
        try{
            const {email,otp,}=req.body;
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
                    await sendEmailVerificationOTP(req,existinguser,"admin")
                    console.log("Invalid OTP. A new OTP has been sent to your email.")
                }
                console.log("Invalid OTP")

            }

            // if otp is expired
            const currentTime=Date.now();
            // 15*60*1000 is 15 minutes in milliseconds
            const expirationTime=new Date(emailVerification.createdAt.getTime()+15*60*1000);
            if(currentTime>expirationTime){
                await sendEmailVerificationOTP(req,existinguser,"admin")
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

    // Admin Login Page-------------------------------
     async AdminLoginPage(req,res){
        try{
            res.render("admin/login",{
                title:"Admin Login Page",
                    user:req.user
            })
        }catch(error){
            console.log("Error in AdminLoginPage",error)
        }
    }


    

        // Admin Login ----------------------------------------------
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
                    sendEmailVerificationOTP(req,user,"admin")
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
                        name:user.name,
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

        // forget password page -----------------------------------------
        async forgetPasswordPage(req,res){
            try{
                res.render("admin/forgetPasswordPage",{
                    title:"Forget Password Page",
                    user:req.user
                })
            }catch(error){
                console.log("Error in forgetpasswordPage",error)
            }
        }

        // send forget password OTP to email -------------------------------------
        async sendForgetPasswordLink(req,res){
            try{
                const{email}=req.body;
                if(!email){
                    console.log("Email is required")

                }
                const user=await Admin.findOne({email})
                if(!user){
                    console.log("admin not found")
                }

                const secret=user._id+process.env.JWT_SECRET;
                const token=jwt.sign(
                    {userId:user._id},
                    secret,
                    {expiresIn:"15m"}
                )

                const resetLink=`${process.env.BACKEND_HOST}/reset-password/${user._id}/${token}`

                await transporter.sendMail({
                    from:process.env.EMAIL_FROM,
                    to:user.email,
                    subject:"Password Reset Link",
                    html:`<p>hello ${user.name}</p>
                    <p>Click the link to reset your password: <a href="${resetLink}">Reset Password</a></p>`,
                })

                console.log("password reset link sent to email")

            }catch(error){
                console.log("Error in sendForgetPasswordLink",error)
            }
        }

        // reset password page ---------------------------------------------
        async resetPasswordPage(req,res){
            try{
                const {id,token}=req.params;

                res.render("admin/resetPassword",{
                    title:"reset passowrd page",
                    user:req.user,
                    userId:id,
                    token:token
                })

            }catch(error){
                console.log("Error in resetPasswordPage",error)
            }
        }

        // reset password --------------------------------------

        async resetPassword(req,res){
            try{
                const {password,confirm_Password}=req.body;
                const {id,token}=req.params;

                const user=await Admin.findById(id);
                if(!user){
                    console.log("Admin not found")
                }

                // token verify

                const secret=user._id + process.env.JWT_SECRET;
                jwt.verify(token,secret)

                if(!password||!confirm_Password){
                    console.log("All fields are required")

                }
                if(password!==confirm_Password){
                    console.log("Password and confirm password do not match")
                }

                const hashedpassword=await bcrypt.hash(password,10);

                await Admin.findByIdAndUpdate(id,{
                    $set:{password:hashedpassword}
                })

                res.redirect("/admin-login-page")

            }catch(error){
                console.log("Error in resetPassword",error)
            }
        }


        // admin management page -------------------------------
        async AdminUserManagement(req,res){
            try{
                const user=await Admin.find()
                res.render("admin/userPage",{
                    title:"User Page",
                    user:req.user,
                    data:user
                })

            }catch(error){
                console.log("Error in userPage",error)
            }
        }
        

        // admin delete ------------------------------------
        async AdminDeleteUser(req,res){
            try{
                const{id}=req.params;
                const user=await Admin.findById(id);
                if(!user){
                    console.log("Admin not found")
                } 
                if(user.imageId){
                    await cloudinary.uploader.destroy(user.imageId);
                }
                await Admin.findByIdAndDelete(id);
                res.redirect("/admin-user-management")
            }catch(error){
                console.log("Error in AdminDeleteUser",error)
            }
        }

        // Admin Dashboard   -----------------------------------------
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

        // Logout  -------------------------------------------------
        async AdminLogout(req,res){
            try{
                res.clearCookie("AdminToken");
                res.redirect("/admin-login-page")

            }catch(error){
                console.log("Error in AdminLogout",error)
            }
        } 


        // specilazation page -------------------------------------
        async specilazationPage(req,res){
            try{
                res.render("admin/specialization",{
                    title:"Specilazation Page",
                    user:req.user
                })

            }catch(error){
                console.log("Error in specilazationPage",error)
            }
        }
        

        // create specilazation ----------------------------------
        async createSpecialization(req,res){
            try{
                const {name}=req.body;
                if(!name){
                    console.log("Name is required")
                }
                const specilazation=new Specialization({name})
                await specilazation.save();
                res.redirect("/specialization-page")
            }catch(error){
                console.log("Error in createSpecialization",error)
            }
        }
        

        // all specialization -------------------------------------
        async allSpecializations(req,res){
            try{
                const specializations=await Specialization.find();
                res.render("admin/allSpecializationPage",{
                    title:"All Specializations",
                    user:req.user,
                    data:specializations
                })
            }catch(error){
                console.log("Error in allSpecialization",error)
            }
        }
        
        // delete specializtion ---------------------
        async DeleteSpecialization(req,res){
            try{
                const {id}=req.params;
                await Specialization.findByIdAndDelete(id);
                res.redirect("/all-specializations")
                console.log("Specialization deleted successfully")

            }catch(error){
                console.log("Error in DeleteSpecialization",error)
            }
        }


        // admin add doctor page and logic ------------------------------------------

        async addDoctorPage(req,res){
            try{
                const specialization=await Specialization.find()
                res.render("admin/addDocterPage",{
                    title:"Add Doctor Page",
                    user:req.user,
                    specialization
                })
            }catch(error){
                console.log("Error in addDoctorPage",error)
            }
        }

        async addDoctor(req,res){
            try{
                const {name,email,password,specialization,experience,consultationFee}=req.body;
                if(!name || !email || !password || !specialization || !experience || !consultationFee){
                    console.log("All fields are required")
                }

                const existingDoctor=await Doctor.findOne({email})

                if(existingDoctor){
                    console.log("Doctor already exist")
                    return res.redirect("/add-doctor-page")
                }

                let image=""
                let imageId=""

                if(req.file){
                    const uploadResult=await new Promise((resolve,reject)=>{
                        cloudinary.uploader.upload_stream(
                            {folder:"doctor_Profile"},
                            (error,result)=>{
                                if(error){
                                    reject(error)
                                }else(resolve(result))
                            }
                        ).end(req.file.buffer)
                    })
                    image=uploadResult.secure_url;
                    imageId=uploadResult.public_id
                }

                // add date time field
                const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

                let availableSclots=[]

                days.forEach(day=>{
                    const off=req.body[`off_${day}`]

                    if(off !=="on"){

                        const start=req.body[`startTime_${day}`]
                        const end=req.body[`endTime_${day}`]

                        if(start && end){

                            availableSclots.push({
                                day:day,
                                startTime:start,
                                endTime:end
                            })
                        }
                    }
                })
                const doctor=new Doctor({
                    name,
                    email,
                    password:await bcrypt.hash(password,10),
                    specialization,
                    is_verified:true,
                    image,
                    imageId,
                    experience,
                    consultationFee,
                    availableSclots
                })
                const result=await doctor.save();

                // send doctor creadintial
                await sendDoctorCredentials(result, password)

                if(result){
                    console.log("Doctor added successfully")
                    res.redirect("/add-doctor-page")
                }

            }catch(error){
                console.log("Error in addDoctor",error)
            }
        }

        async AllDoctor(req,res){
            try{
                const doctor=await Doctor.find().populate("specialization")
                res.render("admin/allDoctorPage",{
                    title:"All doctor page",
                    data:doctor,
                    user:req.user

                })

            }catch(error){
                console.log("error to get all doctor",error)
            }
        }

        async singleDocterPage(req,res){
            try{
                const id=req.params.id;
                const doctor =await Doctor.findById(id).populate("specialization")
                res.render("admin/singleDoctorPage",{
                    title:"single doctor page",
                    user:req.user,
                    doctor
                })

            }catch(error){
                console.log(error,"error to get single doctor page")
            }
        }

        // edit doctor page

        async editDoctorPage(req,res){
            try{
                const id=req.params.id
                const doctor=await Doctor.findById(id)
                const specialization=await Specialization.find()

                res.render("admin/editDoctorPage",{
                    title:"edit page",
                    data:doctor,
                    specialization,
                    user:req.user
                })

            }catch(error){
                console.log(error,"error to get edit page")
            }
        }

        async AdminUpdateDoctor(req,res){
            try{
                const id=req.params.id;

                const {name,specialization,experience,consultationFee}=req.body;

                const doctor=await Doctor.findById(id)

                let image=doctor.image;
                let imageId=doctor.imageId;

                if(req.file){
                    // delete old image from cloudinary
                    if(doctor.imageId){
                        await cloudinary.uploader.destroy(doctor.imageId);

                    }

                    const uploadResult=await new promish ((resolve,reject)=>{
                        cloudinary.uploader.upload_stream(
                            {folder:"doctor_Profile"},
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
                    imageId=uploadResult.public_id
                    }

                    const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
                    
                    let availableSclots=[]


                    days.forEach(day=>{

                    const off=req.body[`off_${day}`]

                    if(off !== "on"){

                        const start=req.body[`startTime_${day}`]
                        const end=req.body[`endTime_${day}`]

                        if(start && end){

                            availableSclots.push({
                                day:day,
                                startTime:start,
                                endTime:end
                            })

                        }

                    }

                })

                    await Doctor.findByIdAndUpdate(id,{
                        name,
                        specialization,
                        experience,
                        consultationFee,
                        availableSclots,
                        image,
                        imageId,
                        availableSclots
                    }) 

                    console.log("Doctor updated successfully")
                    res.redirect("/allDoctor")

            }catch(error){
                console.log(error,"error to to update doctor profile")
            }
        }





        async deleteDoctor(req,res){
            try{
                const {id}=req.params;
                await Doctor.findByIdAndDelete(id)
                console.log("delete doctor sucessfully")
                return res.redirect("/allDoctor")


            }catch(error){
                console.log("error to get delete doctor",error)
            }
        }


}
module.exports=new AdminController()