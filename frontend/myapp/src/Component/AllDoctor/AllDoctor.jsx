import React, { useEffect, useState } from "react";
import { AllDoctors,fetchSpecialization } from "../../Redux/DoctorSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FcNext } from "react-icons/fc";
import { FcPrevious } from "react-icons/fc";
import "../AllDoctor/AllDoctor.css";

export default function AllDoctor() {

const dispatch = useDispatch();

const {doctors,totalPage,currentPage,specialization} = useSelector((state) => state.doctor);

const [search,setSearch]=useState("")
const [selectedSpecialization,setSelectedpecialization]=useState("")
const [page,setPage]=useState(1)

useEffect(()=>{
  dispatch(fetchSpecialization())
},[dispatch])

useEffect(() => {
dispatch(AllDoctors({
  search,
  specialization:selectedSpecialization,
  page
}));
}, [dispatch,search,selectedSpecialization,page]);

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
        <div className="row mb-4 align-items-center">

          {/* Search */}
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search Doctor..."
              value={search}
              onChange={(e)=>{
                setSearch(e.target.value);
                setPage(1)
              }}
            />
          </div>

          {/* Specialization */}
          <div className="col-md-6">
            <select
              className="form-select"
              value={selectedSpecialization}
              onChange={(e)=>{
                setSelectedpecialization(e.target.value);
                setPage(1)
              }}
            >
              <option value="">All Specializations</option>

              {specialization.map((spe)=>(
                <option key={spe._id} value={spe._id}>
                  {spe.name}
                </option>
              ))}
            </select>
          </div>

        </div>

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
            <div className="d-flex justify-content-center mt-4">

  <nav>
    <ul className="pagination">

      {/* Previous Button */}
      <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
        <button
          className="page-link"
          onClick={() => setPage(page - 1)}
        >
          <FcPrevious />
        </button>
      </li>

      {/* Page Numbers */}
      {[...Array(totalPage)].map((_, index) => (
        <li
          key={index}
          className={`page-item ${page === index + 1 ? "active" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => setPage(index + 1)}
          >
            {index + 1}
          </button>
        </li>
      ))}

      {/* Next Button */}
      <li className={`page-item ${page === totalPage ? "disabled" : ""}`}>
        <button
          className="page-link"
          onClick={() => setPage(page + 1)}
        >
          <FcNext />
        </button>
      </li>

    </ul>
  </nav>

</div>
            </div>

    </section>
    

  </main>
</>
);
}