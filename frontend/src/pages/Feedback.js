import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function Feedback() {

  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ optional: coming from payment page
  const bookingData = location.state;

  const [name,setName] = useState(user?.name || "");
  const [rating,setRating] = useState(0);
  const [message,setMessage] = useState("");
  const [loading,setLoading] = useState(false);

  /* =========================
     SUBMIT FEEDBACK
  ========================= */

  const submitFeedback = async (e)=>{

    e.preventDefault();

    if(!name || !message){
      alert("Please fill all fields");
      return;
    }

    if(rating === 0){
      alert("Please give rating");
      return;
    }

    if(!user){
      alert("Please login first");
      navigate("/login");
      return;
    }

    setLoading(true);

    try{

      await axios.post(
        "http://localhost:5000/api/feedback",
        {
          name,
          rating,
          message,

          // ✅ NEW FIELDS
          userEmail: user.email,
          vehicleId: bookingData?.vehicleId || null,
          vehicleName: bookingData?.vehicleName || null
        }
      );

      alert("✅ Thank you for your feedback!");

      navigate("/"); // go home

    }
    catch(error){

      console.log(error);
      alert(
        error.response?.data?.message ||
        "Failed to submit feedback"
      );

    }

    setLoading(false);

  };


  return(

  <div className="container mt-5">

  <h2 className="text-center text-primary">
  Customer Feedback
  </h2>

  <form
  className="col-md-6 mx-auto card p-4 shadow mt-4"
  onSubmit={submitFeedback}
  >

  {/* NAME */}

  <input
  type="text"
  className="form-control mt-2"
  placeholder="Your Name"
  value={name}
  onChange={(e)=>setName(e.target.value)}
  />


  {/* ⭐ RATING */}

  <label className="mt-3">Rate our service</label>

  <div style={{fontSize:"28px"}}>

  {[1,2,3,4,5].map((star)=>(

  <span
  key={star}
  style={{
  cursor:"pointer",
  color: star <= rating ? "gold" : "#ccc"
  }}
  onClick={()=>setRating(star)}
  >

  ★

  </span>

  ))}

  </div>


  {/* MESSAGE */}

  <textarea
  className="form-control mt-3"
  rows="4"
  placeholder="Write your feedback..."
  value={message}
  onChange={(e)=>setMessage(e.target.value)}
  ></textarea>


  {/* SUBMIT */}

  <button
  className="btn btn-success mt-3 w-100"
  disabled={loading}
  >

  {loading ? "Submitting..." : "Submit Feedback"}

  </button>

  </form>

  </div>

  );

}

export default Feedback;