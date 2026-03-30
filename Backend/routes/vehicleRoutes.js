// backend/routes/vehicle.js
const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");

router.post("/vehicles", async (req, res) => {
  try {
    const { vehicleId, vehicleName, vehicleType, pricePerDay, image } = req.body;

    if (!vehicleId ||!vehicleName || !vehicleType || !pricePerDay) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newVehicle = new Vehicle({
      vehicleId,
      vehicleName,
      vehicleType,
      pricePerDay,
      image
    });

    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (err) {
    console.error("Add vehicle error:", err); // log the error
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* =========================
   GET ALL VEHICLES
========================= */

router.get("/vehicles", async (req, res) => {

  try {

    const vehicles = await Vehicle.find().sort({ createdAt: -1 });

    res.json(vehicles);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

});


/* =========================
   GET SINGLE VEHICLE (DETAIL PAGE)
========================= */

router.get("/vehicles/:id", async (req, res) => {

  try {

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    res.json(vehicle);

  } catch (error) {

    res.status(500).json(error);

  }

});


/* =========================
   UPDATE VEHICLE
========================= */

router.put("/vehicles/:id", async (req, res) => {

  try {

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    res.json(vehicle);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

});


/* =========================
   DELETE VEHICLE
========================= */

router.delete("/vehicles/:id", async (req, res) => {

  try {

    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    res.json({
      message: "Vehicle deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

});


/* =========================
   ADD REVIEW (OPTIONAL)
========================= */

router.post("/vehicles/:id/review", async (req, res) => {

  try {

    const { rating } = req.body;

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    /* UPDATE AVERAGE RATING */

    const total = vehicle.totalReviews + 1;

    vehicle.averageRating =
      ((vehicle.averageRating * vehicle.totalReviews) + rating) / total;

    vehicle.totalReviews = total;

    await vehicle.save();

    res.json({
      message: "Review added"
    });

  } catch (error) {
    res.status(500).json(error);
  }

});


module.exports = router;
