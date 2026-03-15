const express=require("express")
const apiAppointmenController = require("../controllers/apiAppointmenController")
const PatisentAuthCheck=require("../middleware/PatisentAuthCheck")

const router=express.Router()

router.post("/createBooking",PatisentAuthCheck,apiAppointmenController.createBooking)
router.post("/verifyPayment",PatisentAuthCheck,apiAppointmenController.verifyPayment)


router.get("/my-bookings",PatisentAuthCheck,apiAppointmenController.getMyBookings)
router.put("/cancel-booking/:id",PatisentAuthCheck,apiAppointmenController.cancelBooking)


module.exports=router