import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function AdminDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const [vehicleId, setVehicleId] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [image, setImage] = useState("");

  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [activeChart, setActiveChart] = useState("");

  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalBookings: 0,
    totalRevenue: 0
  });

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    getVehicles();
    getBookings();
    getFeedback();
    loadStats();
  };

  const getVehicles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/vehicles");
      setVehicles(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings");
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const getFeedback = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/feedback");
      setFeedback(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboardStats");
      setStats(res.data || {});
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // VEHICLE CRUD
  // =========================
  const addVehicle = async (e) => {
    e.preventDefault();
    if (!vehicleId || !vehicleName || !vehicleType || !pricePerDay || !image) {
      alert("Fill all required fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/vehicles", {
        vehicleId,
        vehicleName,
        vehicleType,
        pricePerDay,
        image
      });
      alert("Vehicle Added Successfully");
      resetForm();
      refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to add vehicle");
    }
  };

  const editVehicle = (v) => {
    setVehicleId(v.vehicleId || "");
    setVehicleName(v.vehicleName || "");
    setVehicleType(v.vehicleType || "");
    setPricePerDay(v.pricePerDay || "");
    setImage(v.image || "");
    setEditId(v._id);
    setPage("vehicles");
  };

  const updateVehicle = async (e) => {
    e.preventDefault();
    if (!vehicleId || !vehicleName || !vehicleType || !pricePerDay || !image) {
      alert("Fill all required fields");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/vehicles/${editId}`, {
        vehicleId,
        vehicleName,
        vehicleType,
        pricePerDay,
        image
      });
      alert("Vehicle Updated Successfully");
      resetForm();
      refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to update vehicle");
    }
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
      alert("Vehicle Deleted Successfully");
      refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete vehicle");
    }
  };

  const resetForm = () => {
    setVehicleId("");
    setVehicleName("");
    setVehicleType("");
    setPricePerDay("");
    setImage("");
    setEditId(null);
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "-";

  // =========================
  // CHARTS
  // =========================

  const revenueData = {
    labels: bookings.map((_, i) => `B${i + 1}`),
    datasets: [
      {
        label: "Revenue ₹",
        data: bookings.map((b) => b.totalPrice || 0),
        backgroundColor: "rgba(255, 99, 132, 0.6)"
      }
    ]
  };

  const bookingMap = {};
  bookings.forEach((b) => {
    if (!b || !b.vehicleName) return;
    bookingMap[b.vehicleName] = (bookingMap[b.vehicleName] || 0) + 1;
  });

  const bookingData = {
    labels: Object.keys(bookingMap),
    datasets: [
      {
        label: "Bookings",
        data: Object.values(bookingMap),
        borderColor: "blue",
        backgroundColor: "lightblue",
        fill: true
      }
    ]
  };

  const vehicleMap = {};
  vehicles.forEach((v) => {
    if (!v || !v.vehicleType) return;
    vehicleMap[v.vehicleType] = (vehicleMap[v.vehicleType] || 0) + 1;
  });

  const vehicleData = {
    labels: Object.keys(vehicleMap),
    datasets: [
      {
        label: "Vehicles Count",
        data: Object.values(vehicleMap),
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      }
    ]
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-danger">Admin Dashboard</h2>

      {/* NAV */}
      <div className="text-center mt-4">
        <button className="btn btn-primary m-2" onClick={() => setPage("dashboard")}>Dashboard</button>
        <button className="btn btn-success m-2" onClick={() => setPage("vehicles")}>Vehicles</button>
        <button className="btn btn-warning m-2" onClick={() => setPage("bookings")}>Bookings</button>
        <button className="btn btn-info m-2" onClick={() => setPage("feedback")}>Feedback</button>
      </div>

      {/* DASHBOARD */}
      {page === "dashboard" && (
        <div className="row mt-5">

          <div className="col-md-4">
            <div className="card p-3 text-center shadow" style={{cursor:"pointer"}}
              onClick={() => setActiveChart("vehicles")}>
              <h4>Total Vehicles</h4>
              <h2>{stats.totalVehicles}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 text-center shadow" style={{cursor:"pointer"}}
              onClick={() => setActiveChart("bookings")}>
              <h4>Total Bookings</h4>
              <h2>{stats.totalBookings}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 text-center shadow" style={{cursor:"pointer"}}
              onClick={() => setActiveChart("revenue")}>
              <h4>Total Revenue</h4>
              <h2>₹{stats.totalRevenue}</h2>
            </div>
          </div>

          <div className="col-md-12 mt-5">
            {activeChart === "revenue" && <Bar data={revenueData} />}
            {activeChart === "bookings" && <Line data={bookingData} />}
            {activeChart === "vehicles" && <Bar data={vehicleData} />}
          </div>
        </div>
      )}

      {/* VEHICLES */}
      {page === "vehicles" && (
        <>
          <div className="card p-3 mt-4 shadow">
            <h4>{editId ? "Update Vehicle" : "Add Vehicle"}</h4>

            <input className="form-control mt-2" placeholder="Vehicle ID"
              value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} />

            <input className="form-control mt-2" placeholder="Vehicle Name"
              value={vehicleName} onChange={(e) => setVehicleName(e.target.value)} />

            <select className="form-control mt-2"
              value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
              <option value="">Select Type</option>
              <option>Car</option>
              <option>Bike</option>
              <option>Van</option>
              <option>Bus</option>
            </select>

            <input type="number" className="form-control mt-2"
              placeholder="Price per Day"
              value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} />

            <input className="form-control mt-2"
              placeholder="Image URL"
              value={image} onChange={(e) => setImage(e.target.value)} />

            <button className="btn btn-success mt-3 w-100"
              onClick={editId ? updateVehicle : addVehicle}>
              {editId ? "Update Vehicle" : "Add Vehicle"}
            </button>
          </div>

          <table className="table mt-4 table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Vehicle ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Type</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => (
                <tr key={v._id}>
                  <td>{v.vehicleId}</td>
                  <td><img src={v.image} width="60" alt="" /></td>
                  <td>{v.vehicleName}</td>
                  <td>{v.vehicleType}</td>
                  <td>₹{v.pricePerDay}</td>
                  <td>
                    <button className="btn btn-warning btn-sm m-1"
                      onClick={() => editVehicle(v)}>Edit</button>
                    <button className="btn btn-danger btn-sm"
                      onClick={() => deleteVehicle(v._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* BOOKINGS */}
      {page === "bookings" && (
        <div className="card p-3 mt-4 shadow">
          <h4>All Bookings</h4>
          <table className="table table-bordered text-center mt-3">
            <thead className="table-dark">
              <tr>
                <th>User</th>
                <th>Mobile</th>
                <th>Vehicle</th>
                <th>ID</th>
                <th>From</th>
                <th>To</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Method</th>
                <th>Refund</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id}>
                  <td>{b.customerName}</td>
                  <td>{b.mobileNumber}</td>
                  <td>{b.vehicleName}</td>
                  <td>{b.vehicleId}</td>
                  <td>{formatDate(b.startDate)}</td>
                  <td>{formatDate(b.endDate)}</td>
                  <td>₹{b.totalPrice}</td>
                  <td>{b.paymentStatus}</td>
                  <td>{b.paymentMethod}</td>
                  <td>{b.refundStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FEEDBACK */}
      {page === "feedback" && (
        <div className="card p-3 mt-4 shadow">
          <h4>All Feedback</h4>
          <table className="table table-bordered text-center mt-3">
            <thead className="table-dark">
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map(f => (
                <tr key={f._id}>
                  <td>{f.name}</td>
                  <td>{f.userEmail}</td>
                  <td>{f.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;