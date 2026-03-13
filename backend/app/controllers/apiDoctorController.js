const Doctor=require("../models/doctorModel")



class ApiDoctorController{

    async getAllDoctor(req,res){
        try{
            let {search,specialization, page, limit}=req.query;

            // pagination
            page=parseInt(page)||1;
            limit=parseInt(limit)||6;
            const skip=(page-1) * limit;


            // search
            let query={};

            if(search){
                query.name={$regex: search, $options: "i"};

            }

            if(specialization){
                query.specialization=specialization;
            }

            const doctor=await Doctor.find(query).populate("specialization","name")
            .skip(skip)
            .limit(limit)
            .sort({createdAt:-1})

            // total count

            const total = await Doctor.countDocuments(query)

            return res.status(200).json({
                message:"data fetch successfully",
                data:doctor,
                currentPage:page,
                totalPage:Math.ceil(total/limit),

        })

        }catch(error){
            console.log("error in getting Doctor", error);
            return res.status(500).json({
                message:"internal server error"
            })
        }
    }

}

module.exports= new ApiDoctorController()