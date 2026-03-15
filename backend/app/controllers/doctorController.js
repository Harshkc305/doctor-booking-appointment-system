const transporter  = require("../config/emailConfig")
const sendEmailVerificationOTP = require("../helper/sendEmail")
const Doctor=require("../models/doctorModel")
const EmailVerifyModel=require("../models/otpModel")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")
const cloudinary=require("../config/cloudunaryConfig")
const Specialization = require("../models/specialization")
const Appointment=require("../models/appointmentModel")


class doctorController{
    async doctorDashboard(req, res) {
    try {
        const doctorId = req.user._id;

        // Total Appointments 
        const totalAppointments = await Appointment.countDocuments({ doctorId });

        // Status wise counts
        const pendingCount = await Appointment.countDocuments({ doctorId, status: "pending" });
        const confirmedCount = await Appointment.countDocuments({ doctorId, status: "confirmed" });
        const cancelledCount = await Appointment.countDocuments({ doctorId, status: "cancelled" });

        // Total Revenue
       
        const revenueAgg = await Appointment.aggregate([
            { $match: { doctorId: doctorId, status: "confirmed" } },
            {
                $group: {
                    _id: null,
                    total: { $sum: req.user.consultationFee } 
                }
            }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        // 4. Recent Patients/Appointments List
        const recentAppointments = await Appointment.find({ doctorId })
            .populate("patientId", "name email") 
            .sort({ createdAt: -1 })
            .limit(10);

        res.render("doctor/doctorDashboard", {
            title: "Doctor Dashboard",
            user: req.user,
            totalAppointments,
            pendingCount,
            confirmedCount,
            cancelledCount,
            totalRevenue,
            recentAppointments
        });

    } catch (error) {
        console.log("Error in doctorDashboard:", error);
        res.status(500).send("Internal Server Error");
    }
}

    async doctorotpPage(req,res){
        try{
            res.render("doctor/doctorotpPage",{
                title:"otp page",
                user:req.user

            })

        }catch(error){
            console.log(error,"error to get doctor page")
        }
    }

    async doctorverifyEmail(req,res){
        try{
            const {email,otp}=req.body;
            if(!email,!otp){
                console.log("all field is required")
                
            }
            const existinguser=await Doctor.findOne({email})

            if(!existinguser){
                console.log("Doctor not found please contact to admin")
            }

            const emailVerification=await EmailVerifyModel.findOne({
                doctorId:existinguser._id,
                otp:String(otp)
            })

            if(!emailVerification){
                if(!emailVerification.is_verified){
                    await sendEmailVerificationOTP(req,existinguser,"doctor")
                    console.log(error,"Invalid otp. a new otp is send to your email")
                }
                console.log("invalid otp")
            }

            // if otp is expired
            const currentTime=Date.now();
            // 15*60*1000 is 15 minutes
            const expirationTime=new Date(emailVerification.createdAt.getTime()+15*60*1000);
            if(currentTime>expirationTime){
                await sendEmailVerificationOTP(req,existinguser,"doctor")
            }

            existinguser.is_verified=true;
            await existinguser.save();

            // delete the otp from database after sucessfully
            await EmailVerifyModel.deleteMany({
                doctorId:existinguser._id
            })
            console.log("Email verification sussefully")
            res.redirect("/doctor-login-page")

        }catch(error){
            console.log(error,"error to doctor otp")
        }
    }


    async doctorLoginPage(req,res){
        try{
            res.render("doctor/doctorLoginpage",{
                title:"doctorlogin page",
                user:req.user

            })

        }catch(error){
            console.log(error,"error to get doctor login page")
        }
    }

    async doctorLogin(req,res){
        try{
            const {email,password}=req.body;

            if(!email||!password){
                console.log("all field is required")
                return res.redirect("/doctor-login-page")
            }

            const user=await Doctor.findOne({email})

            if(!user){
                console.log("user not found")
                return res.redirect("/doctor-login-page")
            }

            if(!user.is_verified){
                sendEmailVerificationOTP(req,user,"doctor")
                console.log("email not verifyed. please verify your self")
                return res.redirect("/doctor-otp-page")
            }

            const isMatch=await bcrypt.compare(password,user.password)
            if(!isMatch){
                console.log("incorrect password")
                return res.redirect("/doctor-login-page")
            }

            const token=jwt.sign(
                {
                    doctorId:user._id,
                    name:user.name,
                    email:user.email,

                },
                process.env.JWT_SECRET,
                {expiresIn:"2h"}
            )

            if(token){
                res.cookie("DoctoToken",token);
                return res.redirect("/doctorDashboard")
            }else{
                console.log("Token generation faield")
            }

        }catch(error){
            console.log("error to get login page")
        }
    }

    // forget password page
    async doctorforgetpasswordpage(req,res){
        try{
            res.render("doctor/doctorPasswordpage",{
                title:"password page",
                user:req.user
            })

        }catch(error){
            console.log("error to get page",error)
        }
    }

    async doctorforgotpassword(req,res){
        try{
            const {email}=req.body;
            if(!email){
                console.log("email is required")
            }
            const user=await Doctor.findOne({email})
            if(!user){
                console.log("doctor not found")
            }
            const secret=user._id+process.env.JWT_SECRET;
            const token=jwt.sign(
                {doctorId:user._id},
                secret,
                {expiresIn:"15m"}
            )

            const resetLink=`${process.env.BACKEND_HOST}/doctorresetpassowr/${user._id}/${token}`
            await transporter.sendMail({
                from:process.env.EMAIL,
                to:user.email,
                subject:"password reset link",
                html:`<p>hello${user.name}</p>
                <p>click the link  to reset password :<A href="${resetLink}"Reset password</a></p>`
                
            })

            console.log("[assword reset link send to email")

        }catch(error){
            console.log("error to get subbmit forgetpasswor")
        }
    }

    async doctorResetPasswordPage(req,res){
        try{
            const{id,token}=req.params;

            res.render("doctor/doctorResetPasswordPage",{
                title:"reset passwor page",
                doctorId:id,
                token:token,
                user:req.user
            })

        }catch(error){
            console.log("error to get doctor reset password",error)
        }
    }

    async DoctorResetPassword(req,res){
        try{
            const {password,confirm_Password}=req.body;
            const {id,token}=req.params;

            const user=await Doctor.findById(id)
            if(!user){
                console.log("doctor not found")
            }

            // token verify

            const secret=user._id + process.env.JWT_SECRET;
            jwt.verify(token,secret)

            if(!password||!confirm_Password){
                console.log("all field is required")
            }
            if(password!==confirm_Password){
                console.log("confirn password and passwors must be same")
            }

            const hashedpassword=await bcrypt.hash(password,10)

            await Doctor.findByIdAndUpdate(id,{
                $set:{password:hashedpassword}
            })

            res.redirect("/doctor-login-page")

        }catch(error){
            console.log(error,"error to reste passowrd ")
        }
    }

    async DoctorLogout(req,res){
        try{
            res.clearCookie("DoctoToken");
            res.redirect("/doctor-login-page")

        }catch(error){
            console.log(error,"error to get logout")
        }
    }
// dictor update profile
    async DoctorProfilePage(req,res){
        try{
            const doctor=await Doctor.findById(req.user._id)

            const specialization = await Specialization.find()

            res.render("doctor/doctorProfileUpdate",{
                title:"update profile",
                user:req.user,
                doctor,
                specialization
            })

        }catch(error){
            console.log(error,"error to get profile page")
        }
    }
    

    async DoctorUpdateProfile(req,res){
        try{
            const doctorId=req.user._id;

           const {
            name,
            specialization,
            experience,
            consultationFee
        } = req.body

        const doctor = await Doctor.findById(doctorId)

        let image = doctor.image
        let imageId = doctor.imageId


        if(req.file){
            // delete old image 
             if(doctor.imageId){
                await cloudinary.uploader.destroy(doctor.imageId);

            }


            const uploadResult=await new Promise((resolve,reject)=>{
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
            imageId=uploadResult.public_id;
        }

        // add date time field
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

        const updateData = {
            name,
            specialization,
            experience,
            consultationFee,
            availableSclots,
            image,
            imageId
        }

        const result=await Doctor.findByIdAndUpdate(
            doctorId,
            {$set:updateData},
            {new:true}

        )
        if(result){
            console.log("profile update successfully")
            res.redirect("/doctorDashboard")
        }




        }catch(error){
            console.log("internnal server error")
        }
    }

    async profileViwePage(req,res){
    try{

        const doctor = await Doctor.findById(req.user._id)
        .populate("specialization","name")

        res.render("doctor/profileViewPage",{
            title:"profile view page",
            user:req.user,
            doctor
        })

    }catch(error){
        console.log("error to get profile page",error)
       
    }
}




}
module.exports=new doctorController()