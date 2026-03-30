const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

/* ======================
   MongoDB Connection
====================== */

mongoose.connect("mongodb://127.0.0.1:27017/vehicleRentDB")
.then(()=> console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* ======================
   Models
====================== */

const Vehicle = require("./models/Vehicle");
const Booking = require("./models/Booking");
const Feedback = require("./models/Feedback");
const User = require("./models/User");

/* ======================
   Routes (ONLY VEHICLE HERE)
====================== */

const vehicleRoutes = require("./routes/vehicleRoutes");
app.use("/api", vehicleRoutes);

/* ======================
   TEST API
====================== */

app.get("/", (req, res) => {
  res.send("API Running ✅");
});



/* ======================
   SIGNUP (PASSWORD HASH)
====================== */

app.post("/api/signup", async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "customer"
    });

    await user.save();

    res.json({ message: "Signup Successful" });

  } catch (err) {
    res.status(500).json(err);
  }
});


/* ======================
   LOGIN (COMPARE HASH)
====================== */

app.post("/api/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong Password" });
    }

    res.json({
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    res.status(500).json(err);
  }

});


/* ======================
   FORGOT PASSWORD
====================== */

app.put("/api/forgotPassword", async (req, res) => {

  const { email, newPassword } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {

    res.status(500).json({ message: "Error updating password" });

  }

});

/* ======================
   GET PROFILE
====================== */

app.get("/api/profile/:email", async (req, res) => {

  try {

    const user = await User.findOne({
      email: req.params.email
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json(err);
  }

});

/* ======================
   PROFILE UPDATE
====================== */

app.put("/api/updateProfile", async (req, res) => {

  try {

    const { email, mobile, address, city, state, country } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { mobile, address, city, state, country },
      { new: true }
    );

    res.json(user);

  } catch (err) {
    res.status(500).json(err);
  }

});


/* ======================
   BOOK VEHICLE
====================== */

app.post("/api/bookVehicle", async (req, res) => {

  try {

    const data = req.body;

    const today = new Date();
    today.setHours(0,0,0,0);

    const start = new Date(data.startDate);
    start.setHours(0,0,0,0);

    if (start <= today) {
      return res.status(400).json({
        message: "Start date must be future"
      });
    }

    /* Prevent same date booking */

    const exist = await Booking.findOne({
      vehicleId: data.vehicleId,
      status: { $ne: "Cancelled" },
      startDate: { $lte: new Date(data.endDate) },
      endDate: { $gte: new Date(data.startDate) }
    });

    if (exist) {
      return res.status(400).json({
        message: "Already booked for selected dates"
      });
    }

    const booking = new Booking({
      ...data,
      status: "Booked",
      refundStatus: "Pending"
    });

    await booking.save();

    res.json({ message: "Booking Success" });

  } catch (err) {
    res.status(500).json(err);
  }

});

/* ======================
   MY BOOKINGS (IMPORTANT FIX)
====================== */

app.get("/api/myBookings/:email", async (req, res) => {

  try {

    const bookings = await Booking.find({
      userEmail: req.params.email
    });

    res.json(bookings);

  } catch (err) {
    res.status(500).json(err);
  }

});

/* ======================
   ALL BOOKINGS (ADMIN)
====================== */

app.get("/api/bookings", async (req, res) => {

  try {

    const bookings = await Booking.find();

    res.json(bookings);

  } catch (err) {
    res.status(500).json(err);
  }

});

/* ======================
   CANCEL BOOKING
====================== */

app.put("/api/cancelBooking/:id", async (req, res) => {

  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "Cancelled";
    booking.refundStatus = "Pending"; // ✅ FIXED
    booking.paymentStatus = "Refund Initiated";

    await booking.save();

    res.json({ message: "Booking cancelled successfully" });

  } catch (err) {

    res.status(500).json({ message: "Cancel failed" });

  }

});


/* ======================
   BOOKED DATES (CALENDAR)
====================== */

app.get("/api/bookedDates/:vehicleId", async (req, res) => {

  try {

    const bookings = await Booking.find({
      vehicleId: req.params.vehicleId,
      status: { $ne: "Cancelled" }
    });

    res.json(bookings);

  } catch (err) {
    res.status(500).json(err);
  }

});


/* ======================
   BOOKING COUNT (COLOR)
====================== */

app.get("/api/vehicleBookingStats", async (req, res) => {

  try {

    const stats = await Booking.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: "$vehicleId",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(stats);

  } catch (err) {
    res.status(500).json(err);
  }

});


/* ======================
   PAYMENT HISTORY
====================== */

app.get("/api/paymentHistory/:email", async (req, res) => {

  try {

    const history = await Booking.find({
      userEmail: req.params.email
    });

    res.json(history);

  } catch (err) {
    res.status(500).json(err);
  }

});


/* ======================
   DASHBOARD
====================== */

app.get("/api/dashboardStats", async (req,res)=>{

  try {

    const vehicles = await Vehicle.countDocuments();
    const bookings = await Booking.countDocuments();

    const revenue = await Booking.aggregate([
      {
        $group:{
          _id:null,
          total:{$sum:"$totalPrice"}
        }
      }
    ]);

    res.json({
      totalVehicles: vehicles,
      totalBookings: bookings,
      totalRevenue: revenue[0]?.total || 0
    });

  } catch (error) {
    res.status(500).json(error);
  }

});


/* ======================
   FEEDBACK
====================== */

app.post("/api/feedback", async(req,res)=>{
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.send("Feedback Saved");
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/api/feedback", async(req,res)=>{
  try {
    const feedback = await Feedback.find();
    res.json(feedback);
  } catch (error) {
    res.status(500).json(error);
  }
});


/* ======================
   SERVER
====================== */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});