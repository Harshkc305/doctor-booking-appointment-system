const express =require("express")
const ApiPatisentController=require("../controllers/apiPatisentController")
const PatisentAuthCheck = require("../middleware/PatisentAuthCheck")
const ImageUpload=require("../helper/imageUpload")


const router=express.Router()

router.post("/patisent-Register",ImageUpload.single("image"),ApiPatisentController.patisentRegister)
router.post("/patisent-Login",ApiPatisentController.PatisentLogin)
router.get("/dashboardp",PatisentAuthCheck,ApiPatisentController.dashboardp)
module.exports=router