import React, { useState } from 'react';
import "./Header.css";
import { checkToken, logout } from '../../Redux/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Header() {


  const dispatch=useDispatch()
  const navigate=useNavigate()

  const {isLoggedIn}= useSelector((state)=>state.auth)
  const name=localStorage.getItem("name");
  const image=localStorage.getItem("image")

  useEffect(()=>{
    dispatch(checkToken())
  },dispatch)

  const handleLogout=()=>{
    dispatch(logout());
    navigate("/login")
  }





  // Mobile menu toggle state
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
    // Body par class add/remove karna taaki scrolling control ho sake (optional)
    document.body.classList.toggle('mobile-nav-active');
  };

  return (
    <>
      <header id="header" className="header fixed-top">
        <div className="branding d-flex align-items-center">
          <div className="container position-relative d-flex align-items-center justify-content-between">
            <a href="/" className="logo d-flex align-items-center">
              <h1 className="sitename">DocBook</h1>
            </a>

            {/* Agar isMobileNavOpen true hai toh 'mobile-nav-active' class add hogi */}
            <nav id="navmenu" className={`navmenu ${isMobileNavOpen ? 'mobile-nav-active' : ''}`}>
              <ul>
                <li><a href="/" className="active" onClick={() => setIsMobileNavOpen(false)}>Home</a></li>
                <li><a href="/about" onClick={() => setIsMobileNavOpen(false)}>About</a></li>
                <li><a href="/department" onClick={() => setIsMobileNavOpen(false)}>Departments</a></li>
                <li><a href="/service" onClick={() => setIsMobileNavOpen(false)}>Services</a></li>
                <li><a href="/alldoctor" onClick={() => setIsMobileNavOpen(false)}>Doctors</a></li>
                <li><a href="/contact" onClick={() => setIsMobileNavOpen(false)}>Contact</a></li>
                {/* <li><a href="/register" onClick={() => setIsMobileNavOpen(false)}>Register</a></li> */}
                {/* <li><a href="/login" onClick={() => setIsMobileNavOpen(false)}>Login</a></li> */}
                {isLoggedIn ? (
                  <>
                  <li><a href="/my-bookings" onClick={() => setIsMobileNavOpen(false)}>My Booking</a></li>
                    <li>Hi, {name}</li>
                    <li>
                      {/* 1. Fixed 'ima' to 'img' tag */}
                      {/* 2. Added src check */}
                      <img 
                        src={image && image !== "undefined" ? image : "/default-user.png"} 
                        alt="profile" 
                        className="img" 
                        style={{ width: "30px", height: "30px", borderRadius: "50%" }} // Choti styling
                      />
                    </li>
                    {/* 3. Added text for Logout button */}
                    <li onClick={handleLogout} style={{ cursor: "pointer", color: "red" }}>
                      Logout
                    </li>
                  </>
                ) : (
                  <li><a href="/login" onClick={() => setIsMobileNavOpen(false)}>Login</a></li>
                )}
                {/* <li><a href="/bookappintment" onClick={() => setIsMobileNavOpen(false)}>Book appintement</a></li> */}
              </ul>
              
              {/* Menu icon jo click hone par toggle karega */}
              <i 
                className={`mobile-nav-toggle d-xl-none bi ${isMobileNavOpen ? 'bi-x' : 'bi-list'}`} 
                onClick={toggleMobileNav}
              ></i>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}