const razorpay = require("../config/razorpay");
const Appointment=require("../models/appointmentModel")
const Doctor=require("../models/doctorModel")
const crypto=require("crypto")
const transporter=require("../config/emailConfig")


class ApiAppointmentController{
    async createBooking(req,res){
        try{
            const {doctorId,appointmentDate,appointmentTime}=req.body;
            const patientId=req.user._id;

            const doctor=await Doctor.findById(doctorId);
            if(!doctor){
                return res.status(400).json({
                    message:"Doctor not found"
                })
            }

            const amount=doctor.consultationFee*100;

            const options={
                amount:amount,
                currency:"INR",
                receipt:`receipt_${Date.now()}`,

            }

            const order=await razorpay.orders.create(options)

            const newAppointment= new Appointment({
                doctorId,
                patientId,
                appointmentDate,
                appointmentTime,
                status:"pending",
                orderId: order.id
            })

            await newAppointment.save()

            return res.status(200).json({
                message:"success",
                order,
                appointmentId:newAppointment._id,
                doctorName:doctor.name
            });



        }catch(error){
            return res.status(500).json({
                message:"internal server error"
            })
        }
    }

    async verifyPayment(req, res) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // 1. Update Appointment Status and Populate details for Email
            const updatedAppointment = await Appointment.findByIdAndUpdate(
                appointmentId, 
                { status: "confirmed" },
                { new: true }
            ).populate('patientId').populate({
                path: 'doctorId',
                populate: { path: 'specialization' } // Doctor ki specialization fetch karne ke liye
            });

            // 2. Extract Details
            const patientEmail = updatedAppointment.patientId.email;
            const patientName = updatedAppointment.patientId.name;
            const doctorName = updatedAppointment.doctorId.name;
            const specialization = updatedAppointment.doctorId.specialization?.name || "General";
            const date = new Date(updatedAppointment.appointmentDate).toLocaleDateString();
            const time = updatedAppointment.appointmentTime;

            // 3. Send Email
            const mailOptions = {
                from: `"DocBook Support" <${process.env.EMAIL_USER}>`,
                to: patientEmail,
                subject: "Appointment Confirmation - DocBook",
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color: #007bff;">Appointment Confirmed!</h2>
                        <p>Hello <strong>${patientName}</strong>,</p>
                        <p>Your appointment has been successfully booked. Here are the details:</p>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Doctor:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">Dr. ${doctorName} (${specialization})</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${date}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Time:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${time}</td>
                            </tr>
                        </table>
                        <p style="margin-top: 20px;">Please arrive 10 minutes before your scheduled time.</p>
                        <br>
                        <p>Best Regards,<br><strong>DocBook Team</strong></p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);

            return res.status(200).json({ message: "Payment verified and confirmation email sent!" });
        } else {
            return res.status(400).json({ message: "Invalid payment signature" });
        }
    } catch (error) {
        console.log("Email Error: ", error);
        res.status(500).json({ message: "Verification success but email failed" });
    }
    }

    async getMyBookings(req,res){
        try{
            const patientId=req.user._id;
            const booking=await Appointment.find({patientId}).populate("doctorId", "name image specialization").sort({createdAt: -1})

            return res.status(200).json({
                success:true,
                data:booking
            })

        }catch(error){
            return res.status(500).json({
                message:"internal ser ver error"
            })
        }
    }

    async cancelBooking(req,res){
        try{
            const {id}=req.params;
            const updateStstus=await Appointment.findByIdAndUpdate(id,{status:"cancelled"},{new:true})

            if(!updateStstus){
                return res.status(404).json({message:"appointment not found"})
            }

            return res.status(200).json({
                message:"Appointment cancelled successfully"
            })
        }catch(error){
            return res.status(500).json({
                message:"internal server error"
            })
        }
    }


}
module.exports=new ApiAppointmentController()