const express = require("express");
const AdminController=require("../controllers/adminController")
const ImageUpload=require("../helper/imageUpload")
const AuthCheck=require("../middleware/authCheck")
const router=express.Router();

// Admin Register Page

router.get("/admin-register-page",AdminController.AdminRegisterPage)
router.post("/admin-register",ImageUpload.single("image"),AdminController.AdminRegister)

// Admin Login Page
router.get("/admin-login-page",AdminController.AdminLoginPage)
router.post("/admin-login",AdminController.AdminLogin)

// Admin Dashboard
router.get("/admin-dashboard",AuthCheck,AdminController.AdminDashboard)





module.exports=router;