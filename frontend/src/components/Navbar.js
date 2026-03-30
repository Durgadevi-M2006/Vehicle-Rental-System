import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  /* CLOSE DROPDOWN OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (

    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">

      <div className="container">

        {/* LOGO */}
        <Link className="navbar-brand fw-bold" to="/">
          🚗 Vehicle Rental
        </Link>

        <div className="d-flex align-items-center position-relative">

          {/* USER NAME */}
          {user && (
            <span className="text-white me-3 fw-bold">
              Welcome, {user.name} 👋
            </span>
          )}

          {/* NOT LOGGED */}
          {!user && (
            <>
              <Link className="btn btn-light m-1" to="/login">Login</Link>
              <Link className="btn btn-warning m-1" to="/signup">Signup</Link>
            </>
          )}

          {/* CUSTOMER MENU */}
          {user && user.role === "customer" && (
            <>
              <Link className="btn btn-light m-1" to="/">Home</Link>
              <Link className="btn btn-light m-1" to="/vehicles">Vehicles</Link>
              <Link className="btn btn-light m-1" to="/myBookings">My Bookings</Link>
              <Link className="btn btn-light m-1" to="/about">About Us</Link>

              {/* PROFILE DROPDOWN */}
              <div className="position-relative ms-2" ref={menuRef}>

                <img
                  src={
                    user.profilePic ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="profile"
                  width="40"
                  height="40"
                  style={{
                    borderRadius: "50%",
                    cursor: "pointer",
                    border: "2px solid white"
                  }}
                  onClick={() => setShowMenu(!showMenu)}
                />

                {showMenu && (
                  <div
                    className="card shadow position-absolute"
                    style={{
                      right: 0,
                      top: "50px",
                      width: "220px",
                      zIndex: 1000,
                      borderRadius: "10px"
                    }}
                  >

                    <div className="p-3 text-center">

                      <img
                        src={
                          user.profilePic ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        width="60"
                        height="60"
                        style={{ borderRadius: "50%" }}
                        alt="profile"
                      />

                      <p className="fw-bold mt-2 mb-0">{user.name}</p>
                      <p style={{ fontSize: "12px" }}>{user.email}</p>

                      <hr />

                      <button
                        className="btn btn-light w-100 mb-2"
                        onClick={() => navigate("/profile")}
                      >
                        My Profile
                      </button>

                      <button
                        className="btn btn-light w-100 mb-2"
                        onClick={() => navigate("/paymentHistory")}
                      >
                        Payment History
                      </button>

                      <button
                        className="btn btn-danger w-100"
                        onClick={logout}
                      >
                        Logout
                      </button>

                    </div>

                  </div>
                )}

              </div>
            </>
          )}

          {/* ADMIN MENU */}
          {user && user.role === "admin" && (
            <>
              <Link className="btn btn-light m-1" to="/admin">Dashboard</Link>
              <Link className="btn btn-light m-1" to="/profile">Profile</Link>

              <button
                className="btn btn-danger m-1"
                onClick={logout}
              >
                Logout
              </button>
            </>
          )}

        </div>

      </div>

    </nav>

  );

}

export default Navbar;
