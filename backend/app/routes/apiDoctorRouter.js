const express=require("express")
const ApiDoctorController=require("../controllers/apiDoctorController")

const router=express.Router()

router.get("/getAllDoctor",ApiDoctorController.getAllDoctor)
router.get("/AllSpecialization",ApiDoctorController.allspecialization)
router.get("/SingleDoctor/:id",ApiDoctorController.SingleDoctor)


module.exports=router