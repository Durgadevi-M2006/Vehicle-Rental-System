import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Vehicles() {

  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedType, setSelectedType] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [showCategory, setShowCategory] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [bookingStats, setBookingStats] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    loadVehicles();
    loadBookingStats();
  }, []);

  /* ================================
     LOAD VEHICLES
  ================================= */
  const loadVehicles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/vehicles");
      setVehicles(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================================
     LOAD BOOKING STATS
  ================================= */
  const loadBookingStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/vehicleBookingStats"
      );

      const statsObj = {};
      res.data.forEach(item => {
        statsObj[item._id] = item.count;
      });

      setBookingStats(statsObj);

    } catch (err) {
      console.log(err);
    }
  };

  /* ================================
     BOOK VEHICLE (UPDATED)
  ================================= */
  const book = (vehicle) => {
    // Redirect to Terms page instead of Booking page
    navigate("/terms", { state: vehicle });
  };

  /* ================================
     FILTER DATA
  ================================= */
  const types = [...new Set(vehicles.map(v => v.vehicleType))];

  const models = vehicles
    .filter(v => v.vehicleType === selectedType)
    .map(v => v.vehicleName);

  const filtered = vehicles.filter(v => (
    (search === "" || v.vehicleName.toLowerCase().includes(search.toLowerCase())) &&
    (selectedType === "" || v.vehicleType === selectedType) &&
    (selectedModel === "" || v.vehicleName === selectedModel) &&
    (minPrice === "" || v.pricePerDay >= Number(minPrice)) &&
    (maxPrice === "" || v.pricePerDay <= Number(maxPrice))
  ));

  /* ================================
     BUTTON COLOR LOGIC
  ================================= */
  const getButtonClass = (vehicleId) => {
    const count = bookingStats[vehicleId] || 0;

    if (count === 0) return "btn btn-primary";   // Blue
    if (count <= 2) return "btn btn-warning";    // Yellow
    return "btn btn-danger";                     // Red
  };

  /* ================================
     UI
  ================================= */
  return (

    <div className="container mt-4">

      <h2 className="text-center mb-4">Available Vehicles</h2>

      {/* TOP BAR */}
      <div className="d-flex align-items-center mb-3">

        <button
          className="btn btn-primary"
          onClick={() => {
            setShowCategory(!showCategory);
            setShowFilter(false);
          }}
        >
          Categories
        </button>

        <input
          type="text"
          placeholder="Search vehicle..."
          className="form-control mx-3 text-center"
          style={{ flex: 1 }}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn btn-success"
          onClick={() => {
            setShowFilter(!showFilter);
            setShowCategory(false);
          }}
        >
          Filter
        </button>

      </div>

      {/* CATEGORY */}
      {showCategory && (
        <div className="card p-3 mb-3">

          <h5>Categories</h5>

          <button
            className="btn btn-outline-primary w-100 mt-2"
            onClick={() => {
              setSelectedType("");
              setSelectedModel("");
            }}
          >
            All
          </button>

          {types.map(type => (
            <div key={type}>

              <button
                className={`btn w-100 mt-2 ${
                  selectedType === type ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => {
                  setSelectedType(type);
                  setSelectedModel("");
                }}
              >
                {type}
              </button>

              {selectedType === type && (
                <div style={{ marginLeft: "15px" }}>
                  {[...new Set(models)].map(model => (
                    <button
                      key={model}
                      className={`btn btn-sm w-100 mt-1 ${
                        selectedModel === model ? "btn-success" : "btn-outline-success"
                      }`}
                      onClick={() => setSelectedModel(model)}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              )}

            </div>
          ))}

        </div>
      )}

      {/* FILTER */}
      {showFilter && (
        <div className="card p-3 mb-3">

          <h5>Price Filter</h5>

          <input
            type="number"
            placeholder="Min Price"
            className="form-control mt-2"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max Price"
            className="form-control mt-2"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <button
            className="btn btn-danger mt-3 w-100"
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
            }}
          >
            Clear Filter
          </button>

        </div>
      )}

      {/* VEHICLES */}
      <div className="row">

        {filtered.length === 0 ? (
          <p className="text-center">No vehicles found</p>
        ) : (

          filtered.map(v => (

            <motion.div
              className="col-md-4"
              key={v._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
            >

              <div className="card mt-3 shadow">

                <img
                  src={v.image || "https://via.placeholder.com/300"}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                  alt="vehicle"
                />

                <div className="card-body">

                  <h5>{v.vehicleName}</h5>
                  <p>{v.vehicleType}</p>
                  <p>₹{v.pricePerDay}</p>

                  <button
                    className={getButtonClass(v._id)}
                    onClick={() => book(v)}
                  >
                    Book Now
                  </button>

                </div>

              </div>

            </motion.div>

          ))

        )}

      </div>

    </div>

  );

}

export default Vehicles;