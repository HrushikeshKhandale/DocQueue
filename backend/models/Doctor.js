const mongoose = require("mongoose");

// Define a Doctor Schema
const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  hospitalAddress: {
    type: String,
    required: true,
  },
  contactDetails: {
    phone: {
      type: String,
      required: true,
    },
  },
  achievements: [String], // Store doctor's achievements as an array of strings
  infoForPatients: {
    languages: [String], // List of languages spoken by the doctor
    patientInstructions: String, // Information for patients
    additionalInfo: String, // Additional details for patients
  },
  
  schedule: [
    {
      day: {
        type: String, // e.g., "Monday"
        required: true,
      },
      time: {
        type: String, // e.g., "9:00 AM - 12:00 PM"
        required: true,
      },
    },
    // You can include more availability time slots here as needed
  ],

});

// Create a Doctor Model using the schema
const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
