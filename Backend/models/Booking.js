const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  userEmail: { type: String, required: true },

  /* VEHICLE DETAILS */
  vehicleId: { type: String, required: true },
  vehicleName: { type: String, required: true },
  vehicleType: { type: String },
  vehicleImage: { type: String },

  /* BOOKING DATES */
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  /* PRICE */
  totalPrice: { type: Number, required: true },

  /* PAYMENT */
  paymentMethod: { type: String, enum: ["CARD", "UPI", "PAYTM"], required: true },
  paymentStatus: { type: String, enum: ["Paid", "Refund Initiated", "Failed"], default: "Paid" },
  transactionId: { type: String },

  /* BOOKING STATUS */
  status: { type: String, enum: ["Booked", "Cancelled", "Completed"], default: "Booked" },

  /* REFUND */
  refundStatus: { type: String, enum: ["Pending", "Completed", "Refund in 2 days"], default: "Pending" },

  /* EXTRA FEATURES */
  review: { type: String },
  rating: { type: Number, min: 1, max: 5 },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
