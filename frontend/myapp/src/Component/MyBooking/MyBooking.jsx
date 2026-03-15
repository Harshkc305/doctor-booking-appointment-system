import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, cancelBookingAction } from '../../Redux/DoctorSlice';
import { toast } from 'react-toastify';
import { Calendar, Clock, User, XCircle, CheckCircle, MapPin } from 'lucide-react';

export default function MyBooking() {
    const dispatch = useDispatch();
    const { myBookings } = useSelector((state) => state.doctor);

    useEffect(() => {
        dispatch(fetchMyBookings());
    }, [dispatch]);

    const handleCancel = (id) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            dispatch(cancelBookingAction(id)).unwrap()
                .then(() => toast.warning("Appointment Cancelled"));
        }
    };

    return (
        <div className="container mt-5 py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">My <span className="text-primary">Appointments</span></h2>
                <span className="badge bg-soft-primary text-primary px-3 py-2 rounded-pill">
                    Total: {myBookings.length}
                </span>
            </div>

            {myBookings.length === 0 ? (
                <div className="text-center py-5 shadow-sm rounded bg-light">
                    <Calendar size={48} className="text-muted mb-3" />
                    <p className="text-muted">No appointments found.</p>
                </div>
            ) : (
                <div className="row">
                    {myBookings.map((item) => (
                        <div className="col-lg-6 mb-4" key={item._id}>
                            <div className="card border-0 shadow-sm h-100 hover-shadow transition">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-start justify-content-between">
                                        <div className="d-flex">
                                            {/* Doctor Image with Ring */}
                                            <div className="position-relative">
                                                <img 
                                                    src={item.doctorId?.image || 'https://via.placeholder.com/150'} 
                                                    width="70" 
                                                    height="70" 
                                                    className="rounded-circle object-fit-cover border border-3 border-white shadow-sm"
                                                    alt="doctor"
                                                />
                                            </div>

                                            <div className="ms-3">
                                                <h5 className="mb-1 fw-bold text-dark">Dr. {item.doctorId?.name}</h5>
                                                <p className="text-muted small mb-2">
                                                    <MapPin size={14} className="me-1" /> {item.doctorId?.specialization.name || 'General Physician'}
                                                </p>
                                                
                                                <div className="d-flex flex-wrap gap-3 mt-2">
                                                    <span className="small d-flex align-items-center text-secondary">
                                                        <Calendar size={14} className="me-1 text-primary" />
                                                        {new Date(item.appointmentDate).toLocaleDateString('en-GB', {
                                                            day: '2-digit', month: 'short', year: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="small d-flex align-items-center text-secondary">
                                                        <Clock size={14} className="me-1 text-primary" />
                                                        {item.appointmentTime}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-end">
                                            <span className={`badge rounded-pill px-3 py-2 mb-2 d-inline-block ${
                                                item.status === 'confirmed' ? 'bg-success-subtle text-success' : 
                                                item.status === 'cancelled' ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning'
                                            }`}>
                                                {item.status === 'confirmed' && <CheckCircle size={12} className="me-1" />}
                                                {item.status === 'cancelled' && <XCircle size={12} className="me-1" />}
                                                {item.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    {item.status !== 'cancelled' && (
                                        <div className="mt-4 pt-3 border-top d-flex justify-content-end">
                                            <button 
                                                onClick={() => handleCancel(item._id)} 
                                                className="btn btn-sm btn-outline-danger px-4 rounded-pill transition-all"
                                            >
                                                Cancel Appointment
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .hover-shadow:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                }
                .transition {
                    transition: all 0.3s ease;
                }
                .bg-success-subtle { background-color: #d1e7dd; color: #0f5132; }
                .bg-danger-subtle { background-color: #f8d7da; color: #842029; }
                .bg-warning-subtle { background-color: #fff3cd; color: #664d03; }
                .bg-soft-primary { background-color: #e7f1ff; }
            `}</style>
        </div>
    );
}