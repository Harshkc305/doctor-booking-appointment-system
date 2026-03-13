import React, { useEffect } from "react";
import { AllDoctors } from "../../Redux/DoctorSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../AllDoctor/AllDoctor.css";

export default function AllDoctor() {

const dispatch = useDispatch();

const doctors = useSelector((state) => state.doctor.doctors);

useEffect(() => {
dispatch(AllDoctors());
}, [dispatch]);

return (
<>
  <main class="main">
    <div class="page-title">
      <div class="heading">
        <div class="container">
          <div class="row d-flex justify-content-center text-center">
            
              <div class="col-lg-8">
              <h1 class="heading-title">Doctors</h1>
              <p class="mb-0">
                Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo
                odio sint voluptas consequatur ut a odio voluptatem. Sit dolorum
                debitis veritatis natus dolores. Quasi ratione sint. Sit quaerat
                ipsum dolorem.
              </p>
            </div>
          </div>
        </div>
      </div>
      <nav class="breadcrumbs">
        <div class="container">
          <ol>
            <li><a href="index.html">Home</a></li>
            <li class="current">Doctors</li>
          </ol>
        </div>
      </nav>
    </div>

   
    <section id="doctors" class="doctors section">

      <div class="container" data-aos="fade-up" data-aos-delay="100">

        <div class="row gy-4">
          {doctors.length > 0 ? (
            doctors.map((doctor)=>(
              <div class="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="100" key={doctor._id}>

                <div class="doctor-card">
                  <div class="doctor-image">
                    <img src={doctor.image} alt="Dr. Marcus Johnson" class="img-fluid"/>
                    
                  </div>

                  <div class="doctor-content">
                    <h4>{doctor.name}</h4>
                    <span class="specialty">{doctor.specialization.name}</span>
                    <div class="doctor-meta">
                      <div class="experience">
                        <i class="bi bi-award"></i>
                        <span>{doctor.experience}+ Years Experience</span>
                      </div>
                    </div>
                    <a href="appointment.html" class="btn-appointment">Book Appointment</a>
                  </div>
                </div>
              </div>
            ))
                ):(
                <h4 className="text-center">No Doctor Found</h4>

                )}
            </div>
            </div>

    </section>
    

  </main>
</>
);
}