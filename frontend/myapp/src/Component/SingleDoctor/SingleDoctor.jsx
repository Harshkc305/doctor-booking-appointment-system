import React from 'react'
import { useState,useEffect } from 'react'
import { useDispatch,useSelector } from 'react-redux'

import { fetchsingleDoctor } from '../../Redux/DoctorSlice'
import { Link, useParams } from 'react-router-dom'



export default function SingleDoctor() {

    const {id}=useParams()
    const dispatch=useDispatch()

    const {singleDoctor}=useSelector((state)=>state.doctor)

    useEffect(()=>{
        dispatch(fetchsingleDoctor(id));
    },[dispatch,id]);

    if(!singleDoctor){
        return <h4 className='text-cemter mt-5'> Loading....</h4>

    }

    const images=singleDoctor.images ||singleDoctor.image ||[]


  return (
    <>
      <main className="main">

   
    <div className="page-title">
      <div className="heading">
        <div className="container">
          <div className="row d-flex justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="heading-title">Departments</h1>
              <p className="mb-0">
                Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo
                odio sint voluptas consequatur ut a odio voluptatem. Sit dolorum
                debitis veritatis natus dolores. Quasi ratione sint. Sit quaerat
                ipsum dolorem.
              </p>
            </div>
          </div>
        </div>
      </div>
      <nav className="breadcrumbs">
        <div className="container">
          <ol>
            <li><a href="index.html">Home</a></li>
            <li className="current">Single Doctor</li>
          </ol>
        </div>
      </nav>
    </div>

   
    <section id="departments-tabs" className="departments-tabs section">

      <div className="container" data-aos="fade-up" data-aos-delay="100">

        <div className="medical-specialties">
          <div className="row">

            <div className="col-12">
              <div className="tab-content department-content" id="specialty-content" data-aos="fade-up"
                data-aos-delay="500">

                <div className="tab-pane fade show active" id="departments-tabs-neurology" role="tabpanel"
                  aria-labelledby="neurology-tab">
                  <div className="row department-layout">
                    <div className="col-lg-4 order-lg-2">
                      <div className="department-image">
                        <img src={singleDoctor?.image} alt="Neurology Department" className="img-fluid"/>
                      </div>
                    </div>
                    
                    <div className="col-lg-8 order-lg-1">
                      <div className="department-info">
                        {/* <h2 className="department-title">{singleDoctor?.name}</h2> */}
                        <h2 className="department-title">{singleDoctor?.specialization?.name}</h2>
                

                        <div className="row mt-4">
                          <div className="col-md-6">
                            <div className="service-item">
                              <div className="service-icon">
                                <i className="fas fa-stethoscope"></i>
                              </div>
                              <div className="service-content">
                                <h4>{singleDoctor?.name}</h4>
                                <p>{singleDoctor?.specialization?.name}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="service-item">
                              <div className="service-icon">
                                <i class="bi bi-award"></i>
                              </div>
                              <div className="service-content">
                                <h4>{singleDoctor.experience}+ </h4>
                                <p>Years Experience.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="service-item">
                            <div className="service-icon">
                            <i className="fas fa-calendar-check me-2"></i>
                            </div>

                            <div className="service-content">

                            <h5 className="mb-3">Available Slots</h5>

                            <table className="table table-bordered table-hover align-middle text-center">

                            <thead className="table-light">
                            <tr>
                            <th>Day</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            </tr>
                            </thead>

                            <tbody>

                            {singleDoctor?.availableSclots?.length > 0 ? (

                            singleDoctor.availableSclots.map((slot,index)=>(
                            <tr key={index}>
                            <td>{slot.day}</td>
                            <td>{slot.startTime}</td>
                            <td>{slot.endTime}</td>
                            </tr>
                            ))

                            ):(

                            <tr>
                            <td colSpan="3">No slots available</td>
                            </tr>

                            )}

                            </tbody>

                            </table>

                            </div>
                            </div>
                            </div>
                          <div className="col-md-12 text-center mt-4">

                            <Link
                            to={`/bookappintment/${singleDoctor._id}`}
                            className="btn btn-primary btn-lg"
                            >

                            <i className="fas fa-calendar-plus me-2"></i>
                            Book Appointment

                            </Link>

                            </div>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>
            
          </div>
        </div>

      </div>

    </section>

    
   

  </main>
    </>
  )
}
