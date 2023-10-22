const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const fetchadmin = require('../middleware/fetchadmin');
const fetchuser=require('../middleware/fetchuser');
const fetchdoctor=require('../middleware/fetchdoctor');


const JWT_SECRET = 'HKisagoodb$oy';

// Route 1: Admin Registration
router.post(
  '/register-admin',
  [
    body('username', 'Username is required').isLength({ min: 1 }),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    body('name', 'Name is required').isLength({ min: 1 }),
    body('email', 'Valid email is required').isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, name, email } = req.body;

    try {
      // Check whether an admin with this username already exists
      let admin = await Admin.findOne({ username });
      if (admin) {
        return res.status(400).json({ error: 'An admin with this username already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      admin = await Admin.create({
        username,
        password: hashedPassword,
        name,
        email,
      });

      const data = {
        admin: {
          id: admin.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);

      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

// Route 2: Admin Login
router.post(
  '/login-admin',
  [
    body('username', 'Username is required').isLength({ min: 1 }),
    body('password', 'Password cannot be blank').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }

      const data = {
        admin: {
          id: admin.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);

      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  }
);



// ------------------------------------ USER --------------------------------------------


// Route 3: Get All Users (GET /api/auth/users)
router.get("/getusers", async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
  
  // Route 4: Get a Specific User's Information (GET /api/auth/users/:id)
  router.get("/:id", fetchuser, async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
  
  // Route 5: Update User Information and Password (PUT /api/auth/:id)
  router.put(
    "/:id",
    fetchuser,
    [
      body("name", "Name is required").isLength({ min: 1 }),
      body("email", "Valid email is required").isEmail(),
      body("newPassword", "Password must be at least 5 characters").isLength({
        min: 5,
      }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { name, email, newPassword } = req.body;
  
      try {
        const updatedData = {
          name,
          email,
        };
  
        if (newPassword) {
          // If newPassword is provided in the request, update the password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(newPassword, salt);
          updatedData.password = hashedPassword;
        }
  
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          updatedData,
          { new: true }
        );
  
        if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
        }
        res.json(updatedUser);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    }
  );
  
  // Route 6: Delete a User (DELETE /api/auth/users/:id)
  router.delete("/:id", fetchuser, async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndRemove(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
  
  // Route 7: Add Contact Details (POST /api/auth/add-contact/:id)
  router.post(
    "/add-contact/:id",
    fetchuser,
    [
      body("phone", "Valid phone number is required").isLength({
        min: 10,
        max: 15,
      }),
      body("address", "Address is required").isLength({ min: 1 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { phone, address } = req.body;
  
      try {
        const updatedData = {
          phone,
          address,
        };
  
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          updatedData,
          { new: true }
        );
  
        if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
        }
        res.json(updatedUser);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    }
  );
  
  // Route 8: Add Illness Description (POST /api/auth/add-illness/:id)
  router.post(
    "/add-illness/:id",
    fetchuser,
    [
      body("illnessDescription", "Illness description is required").isLength({
        min: 1,
      }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { illnessDescription } = req.body;
  
      try {
        const updatedData = {
          illnessDescription,
        };
  
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          updatedData,
          { new: true }
        );
  
        if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
        }
        res.json(updatedUser);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    }
  );



//   ------------------------------------ DOCTOR ------------------------------

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
