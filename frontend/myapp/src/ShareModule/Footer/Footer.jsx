import React from 'react'
import "./Footer.css"
export default function Footer() {
  return (
    <>
      <footer className="footer">
      <div className="container">
        <div className="row gy-4">

          {/* About */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-title">About Us</h5>
            <p className="footer-text">
              We are passionate gamers dedicated to providing the best gaming
              and event experience.
            </p>
          </div>

          {/* Game & Event */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-title">Game & Event</h5>
            <ul className="footer-list">
              <li>Upcoming Events</li>
              <li>Live Streaming</li>
              <li>Game Fest 2026</li>
              <li>Pixel Party</li>
            </ul>
          </div>

          {/* Terms */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-title">Terms & Policies</h5>
            <ul className="footer-list">
              <li>Policies</li>
              <li>Terms of Use</li>
              <li>Support</li>
              <li>Privacy</li>
            </ul>
          </div>

          {/* Social + Subscribe */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-title">Follow Us</h5>

            {/* <div className="d-flex gap-3 mb-3">
              <a href="#" className="footer-icon"><BsInstagram /></a>
              <a href="#" className="footer-icon"><FiTwitter /></a>
              <a href="#" className="footer-icon"><FaFacebookF /></a>
              <a href="#" className="footer-icon"><FaLinkedin /></a>
            </div> */}

            <div className="input-group footer-subscribe">
              <input
                type="email"
                className="form-control"
                placeholder="Subscribe Me"
              />
              <button className="btn footer-btn">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <hr className="footer-divider" />
        <p className="text-center footer-copy">
          © 2026 event World. All rights reserved.
        </p>
      </div>
    </footer>
    </>
  )
}
