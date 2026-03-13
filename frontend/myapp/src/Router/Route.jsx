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

      </Routes>
      <Footer/>
    </Router>
      
    </>
  )
}
