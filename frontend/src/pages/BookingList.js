import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BookingList() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {

    if (!user || user.role !== "admin") {
      alert("Access denied. Admin only.");
      navigate("/login");
      return;
    }

    loadBookings();

  }, []);

  /* =========================
     LOAD BOOKINGS
  ========================= */

  const loadBookings = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/bookings"
      );

      // ✅ Latest bookings first
      const sorted = res.data.reverse();

      setBookings(sorted);

    } catch (error) {

      console.log(error);
      alert("Failed to load bookings");

    }

    setLoading(false);
  };

  /* =========================
     FORMAT DATE
  ========================= */

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  /* =========================
     STATUS COLOR
  ========================= */

  const getStatusClass = (status) => {
    return status === "Cancelled"
      ? "text-danger fw-bold"
      : "text-success fw-bold";
  };

  /* =========================
     UI
  ========================= */

  return (

    <div className="container mt-5">

      <h2 className="text-center text-danger">
        All Booking Details
      </h2>

      {loading ? (

        <p className="text-center mt-4">
          Loading bookings...
        </p>

      ) : bookings.length === 0 ? (

        <p className="text-center mt-4">
          No bookings found
        </p>

      ) : (

        <table className="table table-bordered table-striped mt-4 text-center">

          <thead className="table-dark">

            <tr>
              <th>Customer</th>
              <th>Mobile</th>
              <th>Vehicle</th>
              <th>Start</th>
              <th>End</th>
              <th>Total ₹</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Refund</th>
            </tr>

          </thead>

          <tbody>

            {bookings.map((b) => (

              <tr key={b._id}>

                <td>{b.customerName}</td>
                <td>{b.mobileNumber}</td>
                <td>{b.vehicleName}</td>

                <td>{formatDate(b.startDate)}</td>
                <td>{formatDate(b.endDate)}</td>

                <td>₹{b.totalPrice}</td>
                <td>{b.paymentMethod}</td>

                {/* ✅ STATUS */}
                <td className={getStatusClass(b.status)}>
                  {b.status}
                </td>

                {/* ✅ REFUND */}
                <td>
                  {b.status === "Cancelled"
                    ? (b.refundStatus || "Processing")
                    : "-"}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  );

}

export default BookingList;