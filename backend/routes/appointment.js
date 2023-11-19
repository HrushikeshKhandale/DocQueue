const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const fetchuser = require("../middleware/fetchuser");


// Route 1: Book an Appointment (POST /book-appointment)
router.post("/book-appointment", fetchuser, async (req, res) => {
  const { doctor, date, day, time, duration } = req.body;

  try {
    // Check if the user already has an appointment at the same time
    const existingAppointment = await Appointment.findOne({
      doctor,
      user: req.user.id,
      date,
      time,
    });

    if (existingAppointment) {
      return res.status(400).json({ error: "You already have an appointment at this time" });
    }

    const startTime = new Date(`${date} ${time}`);
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    // Check if the selected time slot is already booked
    const isAlreadyBooked = await Appointment.exists({
      doctor,
      date,
      $or: [
        { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gt: startTime } }] },
        { $and: [{ startTime: { $lt: endTime } }, { endTime: { $gte: endTime } }] },
      ],
    });

    if (isAlreadyBooked) {
      return res.status(400).json({ error: "Appointment slot is already booked" });
    }

    const appointment = await Appointment.create({
      doctor,
      user: req.user.id,
      date,
      day,
      time,
      duration,
      status: "scheduled",
    });

    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// Route 2: Get All Appointments for a User (GET /get-appointments)
router.get("/get-appointments", fetchuser, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate("doctor", "name specialty hospital"); // Add the fields you want to populate

    res.json(appointments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
// Route 3: Get a Specific Appointment (GET /appointments/:id)
router.get("/appointments/:id", fetchuser, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("doctor", "name specialty hospital");

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Route 4: Update an Appointment (PUT /appointments/:id)
router.put("/update-appointment/:id", fetchuser, async (req, res) => {
  const { date, day, time, duration, status } = req.body;
  const updatedAppointment = {};

  if (date) updatedAppointment.date = date;
  if (day) updatedAppointment.day = day;
  if (time) updatedAppointment.time = time;
  if (duration) updatedAppointment.duration = duration;
  if (status) updatedAppointment.status = status;

  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Add logic to check if the appointment can be updated (e.g., before 24 hours)
    const currentDateTime = new Date();
    const appointmentDateTime = new Date(`${date} ${time}`);
    const hoursDifference = Math.abs(appointmentDateTime - currentDateTime) / 36e5;

    if (hoursDifference < 24) {
      return res.status(400).json({ error: "Cannot update appointment within 24 hours" });
    }

    // Add logic to restrict certain status changes after a certain point
    if (appointment.status === "completed" && status !== "completed") {
      return res.status(400).json({ error: "Cannot change status after completion" });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { $set: updatedAppointment },
      { new: true }
    );

    res.json(appointment);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// Route 5: Cancel an Appointment (DELETE /appointments/:id)
router.delete("/cancel-appointment/:id", fetchuser, async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if the appointment can be canceled (e.g., before 24 hours)
    const currentDateTime = new Date();
    const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
    const hoursDifference = Math.abs(appointmentDateTime - currentDateTime) / 36e5;

    if (hoursDifference < 24) {
      return res.status(400).json({ error: "Appointment can only be canceled before 24 hours" });
    }

    appointment = await Appointment.findByIdAndRemove(req.params.id);
    res.json({ message: "Appointment canceled successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// Route 6: Check Doctor Availability (GET /doctor-availability/:doctorId)
router.get("/doctor-availability/:doctorId", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const doctorSchedule = doctor.schedule || [];

    // Extract relevant information from the schedule for a cleaner response
    const availabilityInfo = doctorSchedule.map((slot) => ({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    res.json({ doctorAvailability: availabilityInfo });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
