import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyBookings() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);

  const navigate = useNavigate();

  /* =========================
     LOAD BOOKINGS
  ========================= */

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    loadBookings(user.email);

  }, [navigate]);


  const loadBookings = async (email) => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/myBookings/${email}`
      );

      setBookings(res.data);

    } catch (error) {

      console.log(error);
      alert("Failed to load bookings");

    }

    setLoading(false);
  };


  /* =========================
     CANCEL BOOKING
  ========================= */

  const cancelBooking = async (id) => {

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {

      setCancelLoading(id);

      const res = await axios.put(
        `http://localhost:5000/api/cancelBooking/${id}`
      );

      alert(res.data.message);

      // update UI instantly
      setBookings(prev =>
        prev.map(b =>
          b._id === id
            ? {
                ...b,
                status: "Cancelled",
                refundStatus: "Pending",
                paymentStatus: "Refund Initiated"
              }
            : b
        )
      );

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.message || "Cancel failed"
      );

    }

    setCancelLoading(null);
  };


  /* ========================= */

  const formatDate = (date) =>
    new Date(date).toLocaleDateString();

  const getStatusClass = (status) => {
    if (status === "Booked") return "text-success";
    if (status === "Cancelled") return "text-danger";
    return "text-secondary";
  };


  /* =========================
     UI
  ========================= */

  return (

    <div className="container mt-5">

      <h2 className="text-center text-primary mb-4">
        My Booking History
      </h2>

      {loading ? (

        <p className="text-center">Loading bookings...</p>

      ) : bookings.length === 0 ? (

        <p className="text-center">No bookings found</p>

      ) : (

        <div className="table-responsive">

          <table className="table table-bordered table-hover shadow">

            <thead className="table-dark text-center">
              <tr>
                <th>Vehicle</th>
                <th>Vehicle ID</th>
                <th>Mobile</th>
                <th>Dates</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Refund</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody className="text-center">

              {bookings.map((b) => (

                <tr key={b._id}>

                  <td>{b.vehicleName}</td>

                  {/* ✅ VEHICLE ID */}
                  <td>{b.vehicleId || "N/A"}</td>

                  {/* ✅ MOBILE */}
                  <td>{b.mobileNumber || "N/A"}</td>

                  <td>
                    {formatDate(b.startDate)} <br /> to <br />
                    {formatDate(b.endDate)}
                  </td>

                  <td>₹{b.totalPrice}</td>

                  {/* PAYMENT STATUS */}
                  <td>
                    <span className="badge bg-info">
                      {b.paymentStatus || b.paymentMethod || "Paid"}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className={getStatusClass(b.status)}>
                    <b>{b.status}</b>
                  </td>

                  {/* REFUND STATUS */}
                  <td>
                    {b.status === "Cancelled"
                      ? (b.refundStatus || "Processing")
                      : "-"}
                  </td>

                  {/* ACTION */}
                  <td>
                    {b.status !== "Cancelled" ? (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => cancelBooking(b._id)}
                        disabled={cancelLoading === b._id}
                      >
                        {cancelLoading === b._id
                          ? "Cancelling..."
                          : "Cancel"}
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary btn-sm"
                        disabled
                      >
                        Cancelled
                      </button>
                    )}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}

export default MyBookings;