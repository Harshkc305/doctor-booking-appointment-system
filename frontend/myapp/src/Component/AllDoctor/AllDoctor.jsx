import React, { useEffect } from 'react'
import { AllDoctors } from '../../Redux/DoctorSlice'
import { useDispatch, useSelector } from 'react-redux'

export default function AllDoctor() {

  const dispatch = useDispatch()

  const doctors = useSelector((state)=>state.doctor.doctors)

  useEffect(()=>{
    dispatch(AllDoctors())
  },[dispatch])

  return (
    <>
      <div className="container-fluid">
        <h1 className='text-center my-4'>All Doctors</h1>

        <div className="container">
          <div className="row g-4">

            {doctors.map((doctor,index)=>(
              <div key={index}>
                <h4>{doctor.name}</h4>
                <h4>{doctor.email}</h4>
                <h4>{doctor.specialization.name}</h4>
              </div>
            ))}

          </div>
        </div>
      </div>
    </>
  )
}