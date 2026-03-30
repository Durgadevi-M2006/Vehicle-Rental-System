import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaPhone } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {

  const year = new Date().getFullYear();

  return (

    <footer
      className="mt-5 text-white"
      style={{ backgroundColor: "#1e3a8a" }}
    >

      <div className="container py-4">

        <div className="row text-center text-md-start">

          {/* BRAND */}
          <div className="col-md-4 mb-3">
            <h5>🚗 Vehicle Rental</h5>
            <p>
              Rent Cars, Bikes, Vans and Buses easily with best price and safety.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="col-md-4 mb-3">
            <h6>Quick Links</h6>

            <p>
              <Link to="/" className="text-white text-decoration-none">
                Home
              </Link>
            </p>

            <p>
              <Link to="/vehicles" className="text-white text-decoration-none">
                Vehicles
              </Link>
            </p>

            <p>
              <Link to="/about" className="text-white text-decoration-none">
                About Us
              </Link>
            </p>

          </div>

          {/* CONTACT */}
          <div className="col-md-4 mb-3">
            <h6>Contact</h6>

            <p><FaEnvelope /> support@vehiclerental.com</p>
            <p><FaPhone /> +91 9876543210</p>

            {/* SOCIAL */}
            <div className="mt-2">

              <a href="#" className="text-white m-2 fs-5">
                <FaFacebook />
              </a>

              <a href="#" className="text-white m-2 fs-5">
                <FaInstagram />
              </a>

              <a href="#" className="text-white m-2 fs-5">
                <FaTwitter />
              </a>

            </div>

          </div>

        </div>

        <hr style={{ borderColor: "white" }} />

        <p className="text-center mb-0">
          © {year} Vehicle Rental Management System | All Rights Reserved
        </p>

      </div>

    </footer>

  );

}

export default Footer;