const express = require("express");
const appointmentRoutes = require("./appointment.routes");
const patientRoutes = require("./patient.routes");
const usersRoutes = require("./user.routes");

const router = express.Router();

// Route setup
router.use("/appointment", appointmentRoutes);
router.use("/patient", patientRoutes);
router.use("/user", usersRoutes);

module.exports = router;
