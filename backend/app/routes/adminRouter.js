const express = require("express");
const AdminController=require("../controllers/adminController")
const ImageUpload=require("../helper/imageUpload")
const AuthCheck=require("../middleware/authCheck")
const AdminCheck=require("../middleware/adminCheck")
const router=express.Router();

// Admin Register Page
router.get("/admin-register-page",AdminController.AdminRegisterPage)
router.post("/admin-register",ImageUpload.single("image"),AdminController.AdminRegister)

// Admin OTP Page/ verification
router.get("/admin-otp-page",AdminController.otpPage)
router.post("/verifyemail",AdminController.verifyEmail)
// Admin Login Page
router.get("/admin-login-page",AdminController.AdminLoginPage)
router.post("/admin-login",AdminController.AdminLogin)

// Admin Dashboard
router.get("/admin-dashboard",AuthCheck,AdminCheck,AdminController.AdminDashboard)
router.get("/admin-logout",AuthCheck,AdminController.AdminLogout)




module.exports=router;