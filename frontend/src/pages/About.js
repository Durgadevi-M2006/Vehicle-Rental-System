import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function About() {

  const navigate = useNavigate();

  return (

    <div className="container mt-5">

      {/* TITLE */}
      <motion.h2
        className="text-center text-primary fw-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        About Us
      </motion.h2>

      {/* INTRO */}
      <motion.p
        className="text-center mt-4 fs-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Welcome to <b>Vehicle Rental Management System</b> 🚗
      </motion.p>

      <p className="text-center">
        We provide an easy, fast, and reliable platform to rent vehicles
        such as Cars, Bikes, Vans, and Buses at affordable prices.
      </p>


      {/* MISSION */}
      <motion.div
        className="card mt-5 p-4 shadow border-0"
        whileHover={{ scale: 1.02 }}
      >
        <h4 className="text-success">🎯 Our Mission</h4>
        <p className="mt-2">
          To make transportation simple and accessible for everyone
          through a smart and efficient rental system.
        </p>
      </motion.div>


      {/* FEATURES */}
      <motion.div
        className="card mt-4 p-4 shadow border-0"
        whileHover={{ scale: 1.02 }}
      >
        <h4 className="text-success">⭐ Why Choose Us?</h4>

        <ul className="mt-3">
          <li>🚗 Wide range of vehicles</li>
          <li>⚡ Fast booking system</li>
          <li>🔒 Secure payments</li>
          <li>💰 Affordable pricing</li>
          <li>📞 24/7 support</li>
        </ul>
      </motion.div>


      {/* SERVICES */}
      <motion.div
        className="card mt-4 p-4 shadow border-0"
        whileHover={{ scale: 1.02 }}
      >
        <h4 className="text-success">🛠 Our Services</h4>
        <p className="mt-2">
          We provide vehicles for daily travel, tours, business trips,
          and special events.
        </p>
      </motion.div>


      {/* RULES */}
      <motion.div
        className="card mt-4 p-4 shadow border-0"
        whileHover={{ scale: 1.02 }}
      >
        <h4 className="text-danger">📜 Rental Rules</h4>

        <ul className="mt-3">
          <li>Valid driving license required</li>
          <li>Vehicle must be returned on time</li>
          <li>No damage allowed</li>
          <li>Late return → extra charges</li>
          <li>Follow traffic rules strictly</li>
        </ul>
      </motion.div>


      {/* REVIEWS */}
      <motion.div className="mt-5">

        <h4 className="text-center text-primary">⭐ Customer Reviews</h4>

        <div className="row mt-4">

          <div className="col-md-4">
            <div className="card p-3 shadow text-center">
              <h6>Arun</h6>
              <p>⭐⭐⭐⭐⭐</p>
              <p>Very easy booking and good vehicles!</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 shadow text-center">
              <h6>Priya</h6>
              <p>⭐⭐⭐⭐</p>
              <p>Affordable and smooth experience.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 shadow text-center">
              <h6>Vikram</h6>
              <p>⭐⭐⭐⭐⭐</p>
              <p>Highly recommended service!</p>
            </div>
          </div>

        </div>

      </motion.div>


      {/* TEAM */}
      <motion.div className="mt-5">

        <h4 className="text-center text-primary">👨‍💻 Our Team</h4>

        <div className="row mt-4">

          {[{
            name: "Keerthana",
            role: "Frontend Developer",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTieMS0BOSaSLnlwVUDIjvcSS9qc1_9uphC0w&s"
          },{
            name: "Rahul",
            role: "Backend Developer",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz8d6DZUZBBGuGJOSc4Rd-7_z2vRfns9GwHg&s"
          },{
            name: "Aishwarya",
            role: "UI/UX Designer",
            img: "https://img.freepik.com/premium-photo/successful-indian-business-woman-portrait-confident-entrepreneur_753390-9315.jpg"
          }].map((member, i)=>(
            <div className="col-md-4 text-center" key={i}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <img
                  src={member.img}
                  alt="team"
                  width="200"
                  height="200"
                  style={{ borderRadius: "50%" }}
                />
                <h5 className="mt-2">{member.name}</h5>
                <p>{member.role}</p>
              </motion.div>
            </div>
          ))}

        </div>

      </motion.div>


      {/* CONTACT */}
      <motion.div
        className="card mt-5 p-4 shadow border-0"
        whileHover={{ scale: 1.02 }}
      >
        <h4 className="text-success">📞 Contact Us</h4>
        <p className="mt-2">📧 Email: support@vehiclerental.com</p>
        <p>📱 Phone: +91 9876543210</p>
        <p>📍 Location: Chennai, India</p>
      </motion.div>


      {/* CTA */}
      <div className="text-center mt-5">

        <button
          className="btn btn-primary px-4"
          onClick={()=>navigate("/vehicles")}
        >
          🚀 Book Your Vehicle Now
        </button>

        <p className="mt-3">Thank you for choosing us ❤️</p>

      </div>

    </div>

  );

}

export default About;
