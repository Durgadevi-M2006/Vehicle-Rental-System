import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  /* =========================
     AUTO REDIRECT
  ========================= */

  useEffect(() => {

    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (storedUser) {
      if (storedUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/vehicles");
      }
    }

  }, [navigate]);

  return (

    <div className="home-container">

      <div className="overlay d-flex flex-column justify-content-center align-items-center text-center">

        <h1 className="title mb-3">
          🚗 Vehicle Rental Management System
        </h1>

        <p className="subtitle mb-4">
          Rent Cars, Bikes, Vans and Buses Easily
        </p>

        <div className="buttons">

          {/* NOT LOGGED IN */}
          {!user && (
            <>
              <button
                className="btn btn-primary m-2 px-4 py-2 home-btn shadow"
                onClick={() => navigate("/signup")}
              >
                Signup
              </button>

              <button
                className="btn btn-success m-2 px-4 py-2 home-btn shadow"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </>
          )}

          {/* CUSTOMER */}
          {user && user.role === "customer" && (
            <button
              className="btn btn-warning m-2 px-4 py-2 home-btn shadow"
              onClick={() => navigate("/vehicles")}
            >
              Explore Vehicles
            </button>
          )}

          {/* ADMIN */}
          {user && user.role === "admin" && (
            <button
              className="btn btn-danger m-2 px-4 py-2 home-btn shadow"
              onClick={() => navigate("/admin")}
            >
              Go to Dashboard
            </button>
          )}

        </div>

      </div>

    </div>

  );
}

export default Home;