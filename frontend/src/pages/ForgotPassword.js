import React, { useState } from "react";
import axios from "axios";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {

    /* VALIDATION */

    if (!email || !newPassword) {
      alert("Fill all fields");
      return;
    }

    if (!email.includes("@")) {
      alert("Enter valid email");
      return;
    }

    if (newPassword.length < 4) {
      alert("Password must be at least 4 characters");
      return;
    }

    try {

      setLoading(true);

      // ✅ FIXED: use PUT (match backend)
      const res = await axios.put(
        "http://localhost:5000/api/forgotPassword",
        {
          email: email.trim(),
          newPassword: newPassword.trim()
        }
      );

      alert(res.data.message || "Password Reset Successful ✅");

      // clear fields
      setEmail("");
      setNewPassword("");

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message ||
        "Error resetting password"
      );

    }

    setLoading(false);
  };

  return (

    <div className="container d-flex justify-content-center align-items-center vh-100">

      <div
        className="card p-4 shadow-lg"
        style={{ width: "350px", borderRadius: "12px" }}
      >

        <h3 className="text-center text-danger mb-3">
          🔒 Reset Password
        </h3>

        <input
          className="form-control mb-3"
          placeholder="Enter Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="form-control mb-3"
          placeholder="Enter New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          className="btn btn-danger w-100"
          onClick={resetPassword}
          disabled={loading}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

      </div>

    </div>

  );

}

export default ForgotPassword;