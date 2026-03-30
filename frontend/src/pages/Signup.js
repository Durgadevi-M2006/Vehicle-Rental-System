import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup(){

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [role,setRole] = useState("customer");
  const [adminSecret,setAdminSecret] = useState("");

  const [showPassword,setShowPassword] = useState(false);
  const [loading,setLoading] = useState(false);

  // POPUP STATE
  const [popup,setPopup] = useState({show:false,message:"",type:""});

  const navigate = useNavigate();

  // SHOW MESSAGE FUNCTION
  const showMessage = (msg,type)=>{
    setPopup({show:true,message:msg,type});

    setTimeout(()=>{
      setPopup({show:false,message:"",type:""});
      if(type==="success") navigate("/login");
    },2000);
  };

  const signupUser = async(e)=>{

    e.preventDefault();

    if(!name || !email || !password){
      showMessage("All fields required","error");
      return;
    }

    if(!email.includes("@")){
      showMessage("Invalid email","error");
      return;
    }

    if(password.length < 6){
      showMessage("Password must be at least 6 characters","error");
      return;
    }

    if(password !== confirmPassword){
      showMessage("Passwords do not match","error");
      return;
    }

    if(role==="admin" && !adminSecret){
      showMessage("Admin Secret required","error");
      return;
    }

    setLoading(true);

    try{
      await axios.post(
        "http://localhost:5000/api/signup",
        {
          name,
          email,
          password,
          role,
          adminSecret
        }
      );

      showMessage("Signup Successful ✅","success");

    }
    catch(err){
      showMessage(err.response?.data?.message || "Signup Failed","error");
    }

    setLoading(false);
  };

  return(

    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >

      {/* CARD */}
      <div className="card p-4 shadow-lg"
        style={{
          width:"380px",
          borderRadius:"15px",
          backdropFilter:"blur(10px)",
          background:"rgba(255,255,255,0.9)"
        }}
      >

        <h3 className="text-center text-primary mb-3">
          Create Account
        </h3>

        <form onSubmit={signupUser}>

          <input
            className="form-control mb-3"
            placeholder="Full Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            className="form-control mb-3"
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <div className="input-group mb-3">
            <input
              className="form-control"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={()=>setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <input
            className="form-control mb-3"
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
          />

          {/* ROLE */}
          <select
            className="form-control mb-3"
            value={role}
            onChange={(e)=>{
              setRole(e.target.value);
              setAdminSecret("");
            }}
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>

          {/* ADMIN SECRET */}
          {role==="admin" && (
            <input
              className="form-control mb-3"
              placeholder="Admin Secret ID"
              type="password"
              value={adminSecret}
              onChange={(e)=>setAdminSecret(e.target.value)}
            />
          )}

          <button
            className="btn btn-primary w-100 mt-2"
            disabled={loading}
          >
            {loading ? "Creating..." : "Signup"}
          </button>

        </form>

        <p className="text-center mt-3" style={{fontSize:"14px"}}>
          Already have an account?{" "}
          <span
            style={{color:"#0d6efd", cursor:"pointer"}}
            onClick={()=>navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>

      {/* POPUP MESSAGE */}
      {popup.show && (
        <div style={{
          position:"fixed",
          top:"50%",
          left:"50%",
          transform:"translate(-50%, -50%)",
          background: popup.type==="success" ? "#28a745" : "#dc3545",
          color:"#fff",
          padding:"25px 40px",
          borderRadius:"15px",
          fontSize:"22px",
          fontWeight:"bold",
          boxShadow:"0 0 25px rgba(0,0,0,0.3)",
          animation:"fadeIn 0.4s ease"
        }}>
          {popup.message}
        </div>
      )}

      {/* ANIMATION */}
      <style>
        {`
          @keyframes fadeIn {
            from {opacity:0; transform: translate(-50%, -60%);}
            to {opacity:1; transform: translate(-50%, -50%);}
          }
        `}
      </style>

    </div>

  );

}

export default Signup;