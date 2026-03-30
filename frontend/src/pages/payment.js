import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import QRCode from "react-qr-code";

function Payment() {

  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // CARD
  const [cardNo, setCardNo] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // UPI
  const [upi, setUpi] = useState("");

  // PAYTM
  const [paytmNumber, setPaytmNumber] = useState("");

  if (!bookingData) {
    return <h3 className="text-center mt-5">No Booking Data</h3>;
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString();

  // =========================
  // PDF
  // =========================
  const generateTicket = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Vehicle Rental Ticket", 70, 20);

    doc.setFontSize(12);
    doc.text(`Customer: ${bookingData.customerName}`, 20, 40);
    doc.text(`Vehicle: ${bookingData.vehicleName}`, 20, 50);
    doc.text(`From: ${formatDate(bookingData.startDate)}`, 20, 60);
    doc.text(`To: ${formatDate(bookingData.endDate)}`, 20, 70);
    doc.text(`Amount: ₹${bookingData.totalPrice}`, 20, 80);
    doc.text(`Payment: ${method}`, 20, 90);

    doc.save("Ticket.pdf");
  };

  // =========================
  // VALIDATION
  // =========================
  const validatePayment = () => {

    if (!method) {
      alert("Select payment method");
      return false;
    }

    if (method === "CARD") {
      if (cardNo.length !== 16 || cvv.length !== 3) {
        alert("Invalid card details");
        return false;
      }
    }

    if (method === "UPI") {
      const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/;
      if (!upiRegex.test(upi)) {
        alert("Invalid UPI ID");
        return false;
      }
    }

    if (method === "PAYTM") {
      if (paytmNumber.length !== 10) {
        alert("Invalid Paytm number");
        return false;
      }
    }

    return true;
  };

  // =========================
  // PAYMENT
  // =========================
  const payNow = async () => {

    if (!validatePayment()) return;

    try {

      setLoading(true);

      const finalData = {
        ...bookingData,
        paymentMethod: method
      };

      await axios.post(
        "http://localhost:5000/api/bookVehicle",
        finalData
      );

      setSuccess(true);
      generateTicket();

      // ⏳ AUTO REDIRECT AFTER 3 SEC
      setTimeout(() => {
        navigate("/feedback", { state: bookingData });
      }, 3000);

    } catch (error) {
      alert(error.response?.data?.message || "Payment Failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (

    <div className="container mt-5">

      <div className="card col-md-5 mx-auto p-4 shadow-lg rounded">

        <h3 className="text-center mb-3">💳 Secure Payment</h3>

        <h5 className="text-center text-success">
          Amount: ₹{bookingData.totalPrice}
        </h5>

        <button className={`btn w-100 mt-3 ${method==="CARD" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={()=>setMethod("CARD")}>
          💳 Card
        </button>

        <button className={`btn w-100 mt-2 ${method==="UPI" ? "btn-success" : "btn-outline-success"}`}
          onClick={()=>setMethod("UPI")}>
          📱 UPI
        </button>

        <button className={`btn w-100 mt-2 ${method==="PAYTM" ? "btn-info" : "btn-outline-info"}`}
          onClick={()=>setMethod("PAYTM")}>
          🟦 Paytm
        </button>

        {method === "CARD" && (
          <>
            <input className="form-control mt-3" placeholder="Card Number" maxLength="16"
              onChange={(e)=>setCardNo(e.target.value)} />
            <input className="form-control mt-3" placeholder="Expiry"
              onChange={(e)=>setExpiry(e.target.value)} />
            <input className="form-control mt-3" placeholder="CVV" maxLength="3"
              onChange={(e)=>setCvv(e.target.value)} />
          </>
        )}

        {method === "UPI" && (
          <div className="text-center mt-3">
            <QRCode value={`upi://pay?pa=${upi || "demo@upi"}&am=${bookingData.totalPrice}`} />
            <input className="form-control mt-3" placeholder="Enter UPI ID"
              onChange={(e)=>setUpi(e.target.value)} />
          </div>
        )}

        {method === "PAYTM" && (
          <div className="text-center mt-3">
            <QRCode value={`paytm://pay?phone=${paytmNumber || "9999999999"}&am=${bookingData.totalPrice}`} />
            <input className="form-control mt-3" placeholder="Enter Paytm Number"
              maxLength="10"
              onChange={(e)=>setPaytmNumber(e.target.value)} />
          </div>
        )}

        <button className="btn btn-dark mt-4 w-100"
          onClick={payNow} disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>

      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary"></div>
          <p>Processing Payment...</p>
        </div>
      )}

      {/* ✅ SUCCESS ANIMATION */}
      {success && (
        <div style={overlay}>
          <div style={popup}>

            <div className="success-circle">
              <div className="checkmark"></div>
            </div>

            <p className="mt-3 text-success" style={{ fontWeight: "400", fontSize: "18px" }}>
  Payment Successful
</p>

          </div>
        </div>
      )}

      {/* CSS */}
      <style>{`
        .success-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 2px solid green;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: auto;
          animation: pop 0.4s ease;
        }

        .checkmark {
          width: 25px;
          height: 50px;
          border-right: 2px solid green;
          border-bottom: 2px solid green;
          transform: rotate(45deg);
          animation: draw 0.5s ease forwards;
        }

        @keyframes draw {
          from { height: 0; width: 0; }
          to { height: 50px; width: 25px; }
        }

        @keyframes pop {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

    </div>
  );
}

/* overlay styles */
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
  borderRadius: "15px",
  textAlign: "center"
};

export default Payment;