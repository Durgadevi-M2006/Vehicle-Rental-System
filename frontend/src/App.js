import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Vehicles from "./pages/Vehicles";
import Booking from "./pages/Booking";
import AdminDashboard from "./pages/AdminDashboard";
import BookingList from "./pages/BookingList";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feedback from "./pages/Feedback";
import MyBookings from "./pages/MyBookings";
import Payment from "./pages/payment";   // ✅ FIXED
import Profile from "./pages/Profile";
import About from "./pages/About";
import Terms from "./pages/Terms";
import ForgotPassword from "./pages/ForgotPassword"
import Navbar from "./components/Navbar"; // ✅ FIXED
import Footer from "./components/Footer";
import PaymentHistory from "./pages/PaymentHistory";

/* =========================
   ADMIN PROTECTED ROUTE
========================= */
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return user && user.role === "admin"
    ? children
    : <Navigate to="/login" />;
};

/* =========================
   USER PROTECTED ROUTE
========================= */
const UserRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return user
    ? children
    : <Navigate to="/login" />;
};

function App() {

  return (

    <Router>

      <Navbar />

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} /> {/* ✅ fixed */}
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/forgotpassword" element={<ForgotPassword/>}/>

        {/* USER PROTECTED */}
        <Route path="/terms" element={
          <UserRoute><Terms/></UserRoute>
        }/>

        <Route path="/booking" element={
          <UserRoute><Booking /></UserRoute>
        } />

        <Route path="/payment" element={
          <UserRoute><Payment /></UserRoute>
        } />

        <Route path="/myBookings" element={
          <UserRoute><MyBookings /></UserRoute>
        } />

        <Route path="/profile" element={
          <UserRoute><Profile /></UserRoute>
        } />

        <Route path="/paymentHistory" element={
          <UserRoute><PaymentHistory /></UserRoute>
        } />

        {/* ADMIN */}
        <Route path="/admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />

        <Route path="/bookings" element={
          <AdminRoute><BookingList /></AdminRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<h2 className="text-center mt-5">Page Not Found</h2>} />

      </Routes>

      <Footer />

    </Router>

  );

}

export default App;
