const express=require("express")
const ApiDoctorController=require("../controllers/apiDoctorController")

const router=express.Router()

router.get("/getAllDoctor",ApiDoctorController.getAllDoctor)
router.get("/AllSpecialization",ApiDoctorController.allspecialization)

const Specialization=require("../models/specialization")
module.exports=router