// backend/models/Vehicle.js
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicleId:{
        type: String,
        required: true,
    },

    vehicleName: {
      type: String,
      required: [true, "Vehicle name is required"],
      trim: true
    },
    vehicleType: {
      type: String,
      required: [true, "Vehicle type is required"],
      enum: ["Car", "Bike", "Van", "Bus"],
      trim: true
    },
    pricePerDay: {
      type: Number,
      required: [true, "Price per day is required"],
      min: [0, "Price cannot be negative"]
    },
    image: {
      type: String,
      required: [true, "Image URL is required"]
    }
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("Vehicle", vehicleSchema);