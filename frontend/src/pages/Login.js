import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  /* AUTO REDIRECT */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else navigate("/vehicles");
    }
  }, [navigate]);

  /* LOGIN */
  const loginUser = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showMessage("Please enter email and password", false);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/login",
        { email, password }
      );

      localStorage.setItem("user", JSON.stringify(res.data));

      showMessage("Login Successful", true);

      setTimeout(() => {
        if (res.data.role === "admin") navigate("/admin");
        else navigate("/vehicles");
      }, 2000);

    } catch (err) {
      showMessage(
        err.response?.data?.message || "Invalid Email or Password",
        false
      );
    }

    setLoading(false);
  };

  /* FORGOT PASSWORD */
  const forgotPassword = async () => {
    if (!email) {
      showMessage("Enter your email first", false);
      return;
    }

    const newPassword = prompt("Enter new password");

    if (!newPassword || newPassword.length < 4) {
      showMessage("Password must be at least 4 characters", false);
      return;
    }

    try {
      setLoading(true);

      await axios.put("http://localhost:5000/api/forgotPassword", {
        email: email.trim(),
        newPassword: newPassword.trim()
      });

      showMessage("Password updated successfully", true);

    } catch (err) {
      showMessage("Failed to update password", false);
    }

    setLoading(false);
  };

  /* POPUP */
  const showMessage = (msg, success) => {
    setMessage(msg);
    setIsSuccess(success);
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };

  return (
    <div style={bgStyle}>

      <div className="card shadow-lg p-4" style={cardStyle}>
        <h3 className="text-center text-primary mb-3">Login</h3>

        <form onSubmit={loginUser}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="input-group mb-2">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="text-end mb-3">
            <span
              style={{ cursor: "pointer", color: "#0d6efd", fontSize: "14px" }}
              onClick={forgotPassword}
            >
              Forgot Password?
            </span>
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Processing..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          <span>Don't have an account? </span>
          <Link to="/signup" style={{ color: "#0d6efd", textDecoration: "none" }}>
            Create Account
          </Link>
        </div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div style={overlay}>
          <div style={popup}>

            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              border: `3px solid ${isSuccess ? "green" : "red"}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "auto",
              fontSize: "40px",
              color: isSuccess ? "green" : "red"
            }}>
              {isSuccess ? "✔" : "✖"}
            </div>

            <p style={{
              marginTop: "15px",
              fontSize: "20px",
              fontWeight: "400",
              color: isSuccess ? "green" : "red"
            }}>
              {message}
            </p>

          </div>
        </div>
      )}

    </div>
  );
}

/* STYLES */

const bgStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: "url('https://images.unsplash.com/photo-1493238792000-8113da705763')",
  backgroundSize: "cover",
  backgroundPosition: "center"
};

const cardStyle = {
  width: "360px",
  borderRadius: "20px",
  backdropFilter: "blur(12px)",
  background: "rgba(255,255,255,0.9)"
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const popup = {
  background: "#fff",
  padding: "40px",
  borderRadius: "20px",
  textAlign: "center",
  width: "300px",
  animation: "scaleUp 0.3s ease"
};

export default Login;