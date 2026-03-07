const express=require("express")
const DoctorController=require("../controllers/doctorController")
const DoctorAuthCheck=require("../middleware/doctorAuthCheck")
const ImageUpload=require("../helper/imageUpload")


const router=express.Router()

router.get("/doctorDashboard",DoctorAuthCheck,DoctorController.doctorDashboard)

// doctor login page
router.get("/doctor-login-page",DoctorController.doctorLoginPage)
router.post("/Doctor-login",DoctorController.doctorLogin)

// otp page
router.get("/doctor-otp-page",DoctorController.doctorotpPage)
router.post("/doctorVerifyEmail",DoctorController.doctorverifyEmail)

// forget password
router.get("/doctorforgetpasswordpage",DoctorController.doctorforgetpasswordpage)
router.get("/doctor-forgot-password",DoctorController.doctorforgotpassword)


// doctor reset password page
router.get("/doctorresetpassowr/:id/:token",DoctorController.doctorResetPasswordPage)
router.post("/doctor-reset-password/:id/:token",DoctorController.DoctorResetPassword)

// update doctor profile
router.get("/doctor-update-profile-page",DoctorAuthCheck,DoctorController.DoctorProfilePage)
router.post("/doctor-update-profile",DoctorAuthCheck,ImageUpload.single("image"),DoctorController.DoctorUpdateProfile)

// logout
router.get("/doctor-logout",DoctorController.DoctorLogout)
module.exports=router;