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
const fetchadmin = require('../middleware/fetchadmin');


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


// Route 3: Get All Admins (GET /api/admins)
router.get("/getadmins", async (req, res) => {
    try {
      const admins = await Admin.find();
      res.json(admins);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
  
  // Route 4: Get a Specific Admin's Information (GET /api/:id)
  router.get("/:id", fetchadmin, async (req, res) => {
    try {
      const fetchadmin = await User.findById(req.params.id).select("-password");
      if (!fetchadmin) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(fetchadmin);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
  
  // Route 5: Update Admin Information and Password (PUT /api/:id)
  router.put(
    "/:id",
    fetchadmin,
    [
      body("username", "Username is required").isLength({ min: 1 }),
      body("name", "Name is required").isLength({ min: 1 }),
      body("newPassword", "Password must be at least 5 characters").isLength({
        min: 5,
      }),
      body("email", "Valid email is required").isEmail(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { username,name, email, newPassword } = req.body;
  
      try {
        const updatedData = {
          username,
          name,
          email,
        };
  
        if (newPassword) {
          // If newPassword is provided in the request, update the password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(newPassword, salt);
          updatedData.password = hashedPassword;
        }
  
        const updatedAdmin = await User.findByIdAndUpdate(
          req.params.id,
          updatedData,
          { new: true }
        );
  
        if (!updatedAdmin) {
          return res.status(404).json({ error: "Admin not found" });
        }
        res.json(updatedAdmin);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
    }
  );
  
  // Route 6: Delete a User (DELETE /api/auth/users/:id)
  router.delete("/:id", fetchadmin, async (req, res) => {
    try {
      const deletedAdmin = await User.findByIdAndRemove(req.params.id);
      if (!deletedAdmin) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "Admin deleted successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
  

//   ------------------------------------ DOCTOR ------------------------------

// Route 3: Get All Doctors (GET /doctors)
router.get("/getdoctors", fetchadmin,async (req, res) => {
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
  
  
  // Route 6: Admin a Doctor (DELETE /:id)
  router.delete("/:id",fetchadmin, async (req, res) => {
    try {
      const deletedAdmin = await Admin.findByIdAndRemove(req.params.id);
      if (!deletedAdmin) {
        return res.status(404).json({ error: "Admin not found" });
      }
      res.json({ message: "Admin deleted successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
  
module.exports = router;
