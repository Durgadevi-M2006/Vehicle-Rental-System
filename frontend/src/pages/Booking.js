import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const vehicle = location.state;

  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [total, setTotal] = useState(0);

  const [bookedDates, setBookedDates] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  /* LOAD BOOKED DATES */
  useEffect(() => {
    if (vehicle) {
      axios
        .get(`http://localhost:5000/api/bookedDates/${vehicle._id}`)
        .then((res) => setBookedDates(res.data))
        .catch((err) => console.log(err));
    }
  }, [vehicle]);

  /* CHECK DATE CONFLICT */
  const isDateBlocked = (s, e) => {
    const start = new Date(s);
    const end = new Date(e);

    for (let b of bookedDates) {
      const bStart = new Date(b.startDate);
      const bEnd = new Date(b.endDate);

      if (start <= bEnd && end >= bStart) {
        return true;
      }
    }
    return false;
  };

  /* CALCULATE TOTAL */
  const calculate = (s, e) => {
    if (s && e) {
      const start = new Date(s);
      const end = new Date(e);

      if (end < start) {
        alert("End date cannot be before start date");
        setEndDate("");
        setTotal(0);
        return;
      }

      if (isDateBlocked(s, e)) {
        alert("Selected dates already booked");
        setEndDate("");
        setTotal(0);
        return;
      }

      const days = (end - start) / (1000 * 60 * 60 * 24) + 1;
      setTotal(days * vehicle.pricePerDay);
    }
  };

  /* CALENDAR TILE HIGHLIGHT */
  const tileClassName = ({ date }) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    for (let b of bookedDates) {
      let current = new Date(b.startDate);
      let end = new Date(b.endDate);

      current.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      while (current <= end) {
        if (current.getTime() === d.getTime()) {
          return "booked-date";
        }
        current.setDate(current.getDate() + 1);
      }
    }
    return "";
  };

  /* PROCEED TO PAYMENT */
  const proceedToPayment = () => {
    if (!customerName || !mobileNumber || !startDate || !endDate) {
      alert("Please fill all fields");
      return;
    }

    if (mobileNumber.length !== 10) {
      alert("Enter valid mobile number");
      return;
    }

    if (new Date(startDate) < new Date()) {
      alert("Start date must be a future date");
      return;
    }

    if (isDateBlocked(startDate, endDate)) {
      alert("Selected dates already booked");
      return;
    }

    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (total === 0) {
      alert("Invalid booking dates");
      return;
    }

    // Pass booking data to payment page (paymentStatus & method will be set there)
    const bookingData = {
      customerName,
      mobileNumber,
      vehicleId: vehicle._id,
      vehicleName: vehicle.vehicleName,
      startDate,
      endDate,
      totalPrice: total,
      userEmail: user?.email,
    };

    navigate("/payment", { state: bookingData });
  };

  if (!vehicle) {
    return <h3 className="text-center mt-5">No Vehicle Selected</h3>;
  }

  return (
    <div className="container mt-5 text-center">
      <h2>Book Vehicle</h2>

      <img
        src={vehicle.image}
        alt="vehicle"
        width="200"
        className="mt-3"
        style={{ cursor: "pointer" }}
        onClick={() => setShowDetails(!showDetails)}
      />

      <h4 className="mt-3">{vehicle.vehicleName}</h4>
      <p>₹{vehicle.pricePerDay} / day</p>

      {showDetails && (
        <div className="card p-3 mt-3 text-start">
          <h5>Vehicle Details</h5>
          <ul>
            <li>Condition: Excellent</li>
            <li>Fuel Type: Petrol/Diesel</li>
            <li>Insurance: Available</li>
            <li>Service: Regularly maintained</li>
          </ul>

          <button
            className="btn btn-outline-primary mt-2"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            {showCalendar ? "Hide Booked Dates" : "View Booked Dates"}
          </button>

          {showCalendar && (
            <div className="mt-3">
              <Calendar tileClassName={tileClassName} />
            </div>
          )}
        </div>
      )}

      {/* INPUTS */}
      <input
        type="text"
        className="form-control mt-3"
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />

      <input
        type="text"
        className="form-control mt-3"
        placeholder="Mobile Number"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
      />

      <input
        type="date"
        className="form-control mt-3"
        value={startDate}
        onChange={(e) => {
          setStartDate(e.target.value);
          calculate(e.target.value, endDate);
        }}
      />

      <input
        type="date"
        className="form-control mt-3"
        value={endDate}
        onChange={(e) => {
          setEndDate(e.target.value);
          calculate(startDate, e.target.value);
        }}
      />

      {/* BOOKED LIST */}
      <div className="mt-3 text-start">
        <h6>Booked Dates:</h6>
        {bookedDates.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          bookedDates.map((b, i) => (
            <p key={i}>
              {new Date(b.startDate).toDateString()} →{" "}
              {new Date(b.endDate).toDateString()}
            </p>
          ))
        )}
      </div>

      <h4 className="mt-3 text-danger">Total Price: ₹{total}</h4>

      {/* RULES */}
      <div className="card p-3 mt-3 text-start">
        <h5>Rules</h5>
        <ul>
          <li>Valid driving license required</li>
          <li>No damage allowed</li>
          <li>Late return → extra charges</li>
          <li>Cancellation allowed before start date</li>
        </ul>
      </div>

      {/* REVIEWS */}
      <div className="card p-3 mt-3 text-start">
        <h5>Customer Reviews</h5>
        <p>⭐ 4.5 / 5 Rating</p>
        <p>"Good vehicle and smooth ride"</p>
      </div>

      <button className="btn btn-success mt-4" onClick={proceedToPayment}>
        Proceed to Payment
      </button>

      {/* CSS */}
      <style>
        {`
          .booked-date {
            background: red !important;
            color: white !important;
            border-radius: 50%;
          }
        `}
      </style>
    </div>
  );
}

export default Booking;