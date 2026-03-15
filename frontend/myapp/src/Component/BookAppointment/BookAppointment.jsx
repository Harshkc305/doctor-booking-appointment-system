import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchsingleDoctor, createBooking, verifyPaymentAction } from '../../Redux/DoctorSlice';
import { toast } from 'react-toastify'; // Notification ke liye

export default function BookAppointment() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { singleDoctor } = useSelector((state) => state.doctor);
    const { user } = useSelector((state) => state.auth); // Logged in patient details

    const [bookingData, setBookingData] = useState({
        appointmentDate: "",
        appointmentTime: ""
    });

    useEffect(() => {
        dispatch(fetchsingleDoctor(id));
    }, [id]);

    const handlePayment = async (e) => {
        e.preventDefault();
        
        if (!bookingData.appointmentDate || !bookingData.appointmentTime) {
            return alert("Please select date and time");
        }

        // Step 1: Backend se Razorpay Order ID mangwayein
        const response = await dispatch(createBooking({
            doctorId: id,
            ...bookingData
        })).unwrap();

        if (response.order) {
            const options = {
    // Vite mein import.meta.env use hota hai
    key: "rzp_test_Rsp3Os9U7qhad7", 
    amount: response.order.amount,
    currency: "INR",
    name: "DocBook",
    description: `Appointment with Dr. ${response.doctorName}`,
    order_id: response.order.id,
    handler: async function (paymentRes) {
        const verifyData = {
            razorpay_order_id: paymentRes.razorpay_order_id,
            razorpay_payment_id: paymentRes.razorpay_payment_id,
            razorpay_signature: paymentRes.razorpay_signature,
            appointmentId: response.appointmentId
        };

        const finalResult = await dispatch(verifyPaymentAction(verifyData)).unwrap();
        if (finalResult) {
            toast.success("Appointment Booked Successfully!");
            navigate('/my-bookings');
        }
    },
    prefill: {
        name: user?.name,
        email: user?.email,
    },
    theme: { color: "#3fbbc0" }
};

            const rzp = new window.Razorpay(options);
            rzp.open();
        }
    };

    return (
        <div className="container mt-5 py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 card shadow p-4">
                    <h3 className="text-center mb-4">Book Appointment</h3>
                    <div className="d-flex align-items-center mb-3">
                        <img src={singleDoctor?.image} width="70" className="rounded-circle me-3" />
                        <div>
                            <h5>Dr. {singleDoctor?.name}</h5>
                            <p className="text-muted">{singleDoctor?.specialization?.name}</p>
                        </div>
                    </div>
                    <form onSubmit={handlePayment}>
                        <div className="mb-3">
                            <label className="form-label">Select Date</label>
                            <input type="date" className="form-control" onChange={(e) => setBookingData({...bookingData, appointmentDate: e.target.value})} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Select Time</label>
                            <select className="form-select" onChange={(e) => setBookingData({...bookingData, appointmentTime: e.target.value})} required>
                                <option value="">Select Time Slot</option>
                                {singleDoctor?.availableSclots?.map((slot, i) => (
                                    <option key={i} value={`${slot.startTime} - ${slot.endTime}`}>
                                        {slot.day}: {slot.startTime} - {slot.endTime}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 py-2">Pay ₹{singleDoctor?.consultationFee} & Confirm</button>
                    </form>
                </div>
            </div>
        </div>
    );
}