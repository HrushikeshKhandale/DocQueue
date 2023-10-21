const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchdoctor=require('../middleware/fetchdoctor')
const JWT_SECRET = "HKisagoodb$oy";

// Route 1: Doctor Registration (POST /register-doctor)
router.post(
  "/register-doctor",
  [
    body("name", "Name is required").isLength({ min: 1 }),
    body("email", "Valid email is required").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
    body("specialty", "Specialty is required").isLength({ min: 1 }),
    body("location", "Location is required").isLength({ min: 1 }),
    body("hospitalAddress", "Hospital address is required").isLength({
      min: 1,
    }),
    body("contactDetails.phone", "Valid phone number is required").isLength({
      min: 10,
      max: 15,
    }),
    body("achievements").isArray(),
    body("infoForPatients.languages").isArray(),
    body("infoForPatients.patientInstructions", "Patient instructions must be a string").isString(),
    body("infoForPatients.additionalInfo", "Additional info must be a string").isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, specialty, location, hospitalAddress, contactDetails, achievements, infoForPatients } = req.body;

    try {
      // Check whether a doctor with this email already exists
      let doctor = await Doctor.findOne({ email });
      if (doctor) {
        return res.status(400).json({ error: "A doctor with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new doctor
      doctor = await  Doctor.create({
        name,
        email,
        password: hashedPassword,
        specialty,
        location,
        hospitalAddress,
        contactDetails,
        achievements,
        infoForPatients,
      });

      const data = {
        doctor: {
          id: doctor.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);

      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 2: Doctor Login (POST /doctors/login)
router.post(
  "/doctor-login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const doctor = await Doctor.findOne({ email });
      if (!doctor) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, doctor.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const data = {
        doctor: {
          id: doctor.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);

      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3: Get All Doctors (GET /doctors)
router.get("/getdoctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 4: Get a Specific Doctor's Information (GET /:id)
router.get("/:id",fetchdoctor, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json(doctor);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route: Update Doctor Information and Password (PUT /:id)
router.put(
  "/:id",
  fetchdoctor,
  [
    body("name", "Name is required").isLength({ min: 1 }),
    body("email", "Valid email is required").isEmail(),
    body("specialty", "Specialty is required").isLength({ min: 1 }),
    body("location", "Location is required").isLength({ min: 1 }),
    body("hospitalAddress", "Hospital address is required").isLength({ min: 1 }),
    body("contactDetails.phone", "Valid phone number is required").isLength({
      min: 10,
      max: 15,
    }),
    body("achievements").isArray(),
    body("infoForPatients.languages").isArray(),
    body("infoForPatients.patientInstructions", "Patient instructions must be a string").isString(),
    body("infoForPatients.additionalInfo", "Additional info must be a string").isString(),
    body("newPassword", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, specialty, location, hospitalAddress, contactDetails, achievements, infoForPatients, newPassword } = req.body;

    try {
      const updatedData = {
        name,
        email,
        specialty,
        location,
        hospitalAddress,
        contactDetails,
        achievements,
        infoForPatients,
      };

      if (newPassword) {
        // If newPassword is provided in the request, update the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        updatedData.password = hashedPassword;
      }

      const updatedDoctor = await Doctor.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );

      if (!updatedDoctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
      res.json(updatedDoctor);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);


// Route 6: Delete a Doctor (DELETE /:id)
router.delete("/:id",fetchdoctor, async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndRemove(req.params.id);
    if (!deletedDoctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
