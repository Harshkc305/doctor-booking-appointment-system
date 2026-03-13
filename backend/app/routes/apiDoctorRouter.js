const express=require("express")
const ApiDoctorController=require("../controllers/apiDoctorController")

const router=express.Router()

router.get("/getAllDoctor",ApiDoctorController.getAllDoctor)


module.exports=router