import React, { useEffect, useState } from "react";
import axios from "axios";

function PaymentHistory() {
  const API = "http://localhost:5000/api/bookings"; // backend bookings API

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  /* =========================
     LOAD PAYMENTS
  ========================= */
  useEffect(() => {
    if (!user?.email) {
      alert("Please login first");
      setLoading(false);
      return;
    }
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const res = await axios.get(API);

      // FILTER ONLY CURRENT USER
      const userPayments = res.data.filter(
        (p) => p.userEmail === user.email
      );

      // NORMALIZE STATUS
      const normalized = userPayments.map((p) => ({
        ...p,
        paymentStatus:
          p.status === "Cancelled"
            ? p.refundStatus || "Processing"
            : p.status === "Booked"
            ? "Paid"
            : "Pending",
      }));

      // SORT LATEST FIRST
      setPayments(normalized.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ));
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Failed to load payment history");
    }
    setLoading(false);
  };

  /* =========================
     FORMAT DATE
  ========================= */
  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : "-";

  /* =========================
     STATUS BADGE
  ========================= */
  const getStatusBadge = (status) => {
    if (status === "Paid") return "badge bg-success";
    if (status === "Pending") return "badge bg-warning text-dark";
    if (status === "Processing" || status === "Refund Initiated") return "badge bg-info text-dark";
    return "badge bg-secondary";
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Payment History</h2>

      {loading ? (
        <p className="text-center mt-4">Loading payments...</p>
      ) : payments.length === 0 ? (
        <p className="text-center mt-4">No payment records found</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped mt-4 shadow text-center">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Mobile</th>
                <th>Vehicle</th>
                <th>Vehicle ID</th>
                <th>Amount ₹</th>
                <th>Method</th>
                <th>Date</th>
                <th>Payment Status</th>
                <th>Refund</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, index) => (
                <tr key={p._id || index}>
                  <td>{index + 1}</td>
                  <td>{p?.customerName || "-"}</td>
                  <td>{p?.mobileNumber || "-"}</td>
                  <td>{p?.vehicleName || "-"}</td>
                  <td>{p?.vehicleId || "-"}</td>
                  <td>₹{p?.totalPrice || 0}</td>
                  <td>
                    <span className="badge bg-info">{p?.paymentMethod || "-"}</span>
                  </td>
                  <td>{formatDate(p?.createdAt)}</td>
                  <td>
                    <span className={getStatusBadge(p?.paymentStatus)}>
                      {p?.paymentStatus}
                    </span>
                  </td>
                  <td>{p?.status === "Cancelled" ? (p?.refundStatus || "Processing") : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PaymentHistory;