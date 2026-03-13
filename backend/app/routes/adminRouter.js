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

// forget password page
router.get("/forget-password-page",AdminController.forgetPasswordPage)
router.post("/forgot-password",AdminController.sendForgetPasswordLink)


// reset password page
router.get("/reset-password/:id/:token",AdminController.resetPasswordPage)
router.post("/reset-password/:id/:token",AdminController.resetPassword)



// Admin Login Page
router.get("/admin-login-page",AdminController.AdminLoginPage)
router.post("/admin-login",AdminController.AdminLogin)

// Admin Dashboard
router.get("/admin-dashboard",AuthCheck,AdminCheck,AdminController.AdminDashboard)
router.get("/admin-logout",AuthCheck,AdminController.AdminLogout)


// Admin User Management
router.get("/admin-user-management",AuthCheck,AdminCheck,AdminController.AdminUserManagement)

// Admin Delete User
router.get("/admin-delete/:id",AuthCheck,AdminCheck,AdminController.AdminDeleteUser)

// specilazation management
router.get("/specialization-page",AuthCheck,AdminCheck,AdminController.specilazationPage)
router.post("/createspecialization",AuthCheck,AdminCheck,AdminController.createSpecialization)

// All Specializations
router.get("/all-specializations",AuthCheck,AdminCheck,AdminController.allSpecializations)

// delete specialization
router.get("/deleteSpecialization/:id",AuthCheck,AdminCheck,AdminController.DeleteSpecialization)

// add doctor page
router.get("/add-doctor-page",AuthCheck,AdminCheck,AdminController.addDoctorPage)
router.post("/add-doctor",AuthCheck,AdminCheck,ImageUpload.single("image"),AdminController.addDoctor)
router.get("/allDoctor",AuthCheck,AdminController.AllDoctor)
// single doctor
router.get("/single-Docter-Page/:id",AuthCheck,AdminCheck,AdminController.singleDocterPage)
// edit doctor page
router.get("/edit-Doctor-Page/:id",AuthCheck,AdminCheck,AdminController.editDoctorPage)
router.post("/Admin-Update-Doctor/:id",AuthCheck,AdminCheck,ImageUpload.single("image"),AdminController.AdminUpdateDoctor)

router.get("/delete-Doctor/:id",AuthCheck,AdminCheck,AdminController.deleteDoctor)

module.exports=router;