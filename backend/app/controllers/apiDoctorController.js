const Doctor=require("../models/doctorModel")



class ApiDoctorController{

    async getAllDoctor(req,res){
        try{
            const doctor=await Doctor.find().populate("specialization","name")

            return res.status(200).json({
                message:"data fetch successfully",
                data:doctor
        })

        }catch(error){
            return res.status(500).json({
                message:"internal server error"
            })
        }
    }

}

module.exports= new ApiDoctorController()