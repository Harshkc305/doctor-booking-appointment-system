import React from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import Header from '../ShareModule/Header/Header'
import Footer from '../ShareModule/Footer/Footer'
import Home from '../Component/Home/Home'
import About from '../Component/About/About'
import AllDoctor from '../Component/AllDoctor/AllDoctor'
import Departments from '../Departments/Departments'
import Service from '../Component/service/Service'
import Contact from '../Component/Contact/Contact'
import SingleDoctor from '../Component/SingleDoctor/SingleDoctor'
import Register from '../Component/Register/Register'
import Login from '../Component/Login/Login'
import BookAppointment from '../Component/BookAppointment/BookAppointment'
import MyBooking from '../Component/MyBooking/MyBooking'
export default function Rout() {
  return (
    <>
    <Router>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/alldoctor" element={<AllDoctor/>}/>
        <Route path="/department" element={<Departments/>}/>
        <Route path='/service' element={<Service/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/singledoctor/:id" element={<SingleDoctor/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/bookappintment/:id" element={<BookAppointment/>}/>
        <Route path="/my-bookings" element={<MyBooking/>}/>

      </Routes>
      <Footer/>
    </Router>
      
    </>
  )
}
