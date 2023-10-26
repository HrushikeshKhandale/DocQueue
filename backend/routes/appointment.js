const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
// const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const Doctor = require('../models/Doctor');

// Route 1: Create an Appointment (POST /book-appointment)
router.post("/book-appointment", fetchuser, async (req, res) => {
  const { doctor, date, startTime, duration } = req.body;

  try {
    // Find the selected doctor
    const selectedDoctor = await Doctor.findById(doctor);
    if (!selectedDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Check if the selected doctor has a schedule
    if (!selectedDoctor.schedule || !Array.isArray(selectedDoctor.schedule)) {
      return res.status(400).json({ error: "Doctor's schedule is not available" });
    }

    // Calculate the end time based on the start time and duration
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(startTimeDate.getTime() + duration * 60 * 1000);

    const isAvailable = selectedDoctor.schedule.some((slot) => {
      // Check if the appointment overlaps with an existing slot
      return (
        slot.date === date &&
        ((startTimeDate >= new Date(slot.startTime) && startTimeDate < new Date(slot.endTime)) ||
          (endTimeDate > new Date(slot.startTime) && endTimeDate <= new Date(slot.endTime)))
      );
    });

    if (isAvailable) {
      return res.status(400).json({ error: "Selected date and time are not available" });
    }

    // Create a new appointment and add it to the doctor's schedule
    const appointment = await Appointment.create({
      doctor,
      user: req.user.id,
      date,
      startTime: startTimeDate,
      endTime: endTimeDate,
    });

    // Update the doctor's schedule to mark the slot as unavailable
    selectedDoctor.schedule.push({
      date,
      startTime: startTimeDate,
      endTime: endTimeDate,
    });

    await selectedDoctor.save();

    res.json(appointment);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});



// Route 2: Get All Appointments for a User (GET /get-appointments)
router.get("/get-appointments", fetchuser, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id });
    res.json(appointments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 3: Get a Specific Appointment (GET /:id)
router.get("/:id", fetchuser, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 4: Update an Appointment (PUT /update-appointment/:id)
router.put("/update-appointment/:id", fetchuser, async (req, res) => {
  const { date, time, status } = req.body;
  const updatedAppointment = {};

  if (date) updatedAppointment.date = date;
  if (time) updatedAppointment.time = time;
  if (status) updatedAppointment.status = status;

  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if the user is the owner of the appointment
    if (appointment.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
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

// Route 5: Cancel an Appointment (DELETE /cancel-appointment/:id)
router.delete("/cancel-appointment/:id", fetchuser, async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if the user is the owner of the appointment
    if (appointment.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    appointment = await Appointment.findByIdAndRemove(req.params.id);
    res.json({ message: "Appointment canceled successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 6: Get Doctor's Availability (GET /doctor-availability/:id)
router.get("/doctor-availability/:id", async (req, res) => {
  try {
    const doctorId = req.params.id;

    // Retrieve the selected doctor's information
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Return the doctor's schedule as availability
    res.json(doctor.schedule);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;








































































// const express = require("express");
// const router = express.Router();
// const Appointment = require("../models/Appointment");
// const { body, validationResult } = require("express-validator");
// const fetchuser = require("../middleware/fetchuser");
// // const fetchdoctor = require("../middleware/fetchdoctor");
// const Doctor=require('../models/Doctor');
// // const User=require('../models/User');

// // Route 1: Create an Appointment (POST /api/appointments)
// router.post(
//   "/book-appointment",
//   fetchuser, // Ensure the user is logged in
//   [
//     body("doctor", "Doctor ID is required").isMongoId(),
//     body("date", "Appointment date is required").isDate(),
//     body("time", "Appointment time is required").isString(),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { doctor, date, time } = req.body;

//     try {
//       // Create a new appointment
//       const appointment = await Appointment.create({
//         doctor,
//         user: req.user.id, // Get the user ID from the logged-in user
//         date,
//         time,
//       });

//       res.json(appointment);
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );

// // Route 2: Get All Appointments for a User (GET /api/appointments)
// router.get("/get-appointments", fetchuser, async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ user: req.user.id });
//     res.json(appointments);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Route 3: Get a Specific Appointment (GET /api/appointments/:id)
// router.get("/:id", fetchuser, async (req, res) => {
//   try {
//     const appointment = await Appointment.findOne({
//       _id: req.params.id,
//       user: req.user.id,
//     });
//     if (!appointment) {
//       return res.status(404).json({ error: "Appointment not found" });
//     }
//     res.json(appointment);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Route 4: Update an Appointment (PUT /api/appointments/:id)
// router.put("/update-appointment/:id", fetchuser, async (req, res) => {
//   const { date, time, status } = req.body;
//   const updatedAppointment = {};

//   if (date) updatedAppointment.date = date;
//   if (time) updatedAppointment.time = time;
//   if (status) updatedAppointment.status = status;

//   try {
//     let appointment = await Appointment.findById(req.params.id);

//     if (!appointment) {
//       return res.status(404).json({ error: "Appointment not found" });
//     }

//     // Check if the user is the owner of the appointment
//     if (appointment.user.toString() !== req.user.id) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     appointment = await Appointment.findByIdAndUpdate(
//       req.params.id,
//       { $set: updatedAppointment },
//       { new: true }
//     );

//     res.json(appointment);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Route 5: cancel an Appointment (DELETE /api/appointments/:id)
// router.delete("/cancel-appointment/:id", fetchuser, async (req, res) => {
//   try {
//     let appointment = await Appointment.findById(req.params.id);

//     if (!appointment) {
//       return res.status(404).json({ error: "Appointment not found" });
//     }

//     // Check if the user is the owner of the appointment
//     if (appointment.user.toString() !== req.user.id) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     appointment = await Appointment.findByIdAndRemove(req.params.id);
//     res.json({ message: "Appointment canceled successfully" });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// });



// // Route to search for doctors by name or specialty
// router.get("/search-doctors", async (req, res) => {
//     const { name, specialty } = req.query;
  
//     try {
//       // Create a query to find doctors based on name or specialty
//       const query = {};
//       if (name) query.name = { $regex: name, $options: "i" }; // Case-insensitive name search
//       if (specialty) query.specialty = { $regex: specialty, $options: "i" }; // Case-insensitive specialty search
  
//       const doctors = await Doctor.find(query);
  
//       res.json(doctors);
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send("Internal Server Error");
//     }
//   });

  

// // Route to view doctor's availability
// router.get("/doctor-availability/:id", async (req, res) => {
//   const doctorId = req.params.id;

//   try {
//     // Retrieve the selected doctor's information
//     const doctor = await Doctor.findById(doctorId);

//     if (!doctor) {
//       return res.status(404).json({ error: "Doctor not found" });
//     }

//     // You can add the doctor's schedule to the response
//     const doctorAvailability = doctor.schedule; // Assuming "schedule" is an array of available time slots

//     res.json(doctorAvailability);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// });

  



// module.exports = router;
