import React from 'react'
import "./Header.css"
export default function Header() {
  return (
    <>
      <header id="header" className="header fixed-top">
        <div className="branding d-flex align-items-cente">

      <div className="container position-relative d-flex align-items-center justify-content-between">
        <a href="/" className="logo d-flex align-items-center">
          
          <h1 className="sitename">DocBook</h1>
        </a>

        <nav id="navmenu" className="navmenu">
          <ul>
            <li><a href="/" className="active">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/department">Departments</a></li>
            <li><a href="/service">Services</a></li>
            <li><a href="/alldoctor">Doctors</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="testimonials.html">Testimonials</a></li>
            <li><a href="appointment.html">Appointment</a></li>
            
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
        </nav>

      </div>

    </div>
      </header>
    </>
  )
}
