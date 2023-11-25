import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap"; 
import register from "./styles/registration-counter-register-notes-registration-svgrepo-com.svg";

const DoctorRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
    hospital: "",
    hospitalAddress: "",
    contactDetails: {
      phone: "",
    },
    achievements: [], // Handling achievements as an array
    infoForPatients: {
      languages: [], // Handling languages as an array
      patientInstructions: "",
      additionalInfo: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState(null);

  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear validation messages when the user starts editing a field
    }));
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value.split(",").map((item) => item.trim()), // Split input values into an array
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear validation messages for the array field
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate each field here
    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }

    if (formData.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
    }

    // Add similar validation for other fields

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Form is valid if there are no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Handle form submission
      // Use fetch or your preferred method to send data to the server
      // Update the API endpoint and method accordingly

      try {
        const response = await fetch("http://localhost:3001/api/doctor/register-doctor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const json = await response.json();

        if (json.authtoken) {
          // Save the auth token and redirect
          localStorage.setItem("token", json.authtoken);
          history.push("/login");
        } else {
          setAlertMessage("Invalid credentials");
        }
      } catch (error) {
        console.error("Error:", error);
        setAlertMessage("Internal Server Error");
      }
    } else {
      setAlertMessage("Please fill out the form correctly");
    }
  };

  return (
    <div className="container">
       <div className="col-md-6">
        {/* Healthcare-related Image */}
        <img src={register} alt="Healthcare Banner" style={{ height: "18pc",position:'relative',bottom:'12cm',left:'2cm' }} className="img-fluid rounded" />
      </div>
      <h2 className="regTitle">Doctor Registration</h2>
      <Form onSubmit={handleSubmit} style={{position:'relative',top:'10cm',right:'4cm'}}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <Form.Text className="text-danger">{errors.name}</Form.Text>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Form.Text className="text-danger">{errors.email}</Form.Text>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Form.Text className="text-danger">{errors.password}</Form.Text>
        </Form.Group>

        <Form.Group controlId="specialty">
          <Form.Label>Specialty</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your specialty"
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
          />
          <Form.Text className="text-danger">{errors.specialty}</Form.Text>
        </Form.Group>

        <Form.Group controlId="hospital">
          <Form.Label>Hospital</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the hospital name"
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
          />
          <Form.Text className="text-danger">{errors.hospital}</Form.Text>
        </Form.Group>

        <Form.Group controlId="hospitalAddress">
          <Form.Label>Hospital Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the hospital address"
            name="hospitalAddress"
            value={formData.hospitalAddress}
            onChange={handleChange}
          />
          <Form.Text className="text-danger">{errors.hospitalAddress}</Form.Text>
        </Form.Group>

        <Form.Group controlId="contactDetails.phone">
          <Form.Label>Contact Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your contact number"
            name="contactDetails.phone"
            value={formData.contactDetails.phone}
            onChange={handleChange}
          />
          <Form.Text className="text-danger">{errors.contactDetails?.phone}</Form.Text>
        </Form.Group>

        <Form.Group controlId="achievements">
          <Form.Label>Achievements (comma-separated)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your achievements"
            name="achievements"
            value={formData.achievements.join(", ")} // Join array for display
            onChange={handleArrayChange}
          />
          <Form.Text className="text-danger">{errors.achievements}</Form.Text>
        </Form.Group>

        <Form.Group controlId="infoForPatients.languages">
          <Form.Label>Languages (comma-separated)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter languages"
            name="infoForPatients.languages"
            value={formData.infoForPatients.languages.join(", ")} // Join array for display
            onChange={handleArrayChange}
          />
          <Form.Text className="text-danger">{errors.infoForPatients?.languages}</Form.Text>
        </Form.Group>

        <Form.Group controlId="infoForPatients.patientInstructions">
          <Form.Label>Patient Instructions</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter patient instructions"
            name="infoForPatients.patientInstructions"
            value={formData.infoForPatients.patientInstructions}
            onChange={handleChange}
          />
          <Form.Text className="text-danger">{errors.infoForPatients?.patientInstructions}</Form.Text>
        </Form.Group>

        <Form.Group controlId="infoForPatients.additionalInfo">
          <Form.Label>Additional Info</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter additional info"
            name="infoForPatients.additionalInfo"
            value={formData.infoForPatients.additionalInfo}
            onChange={handleChange}
          />
          <Form.Text className="text-danger">{errors.infoForPatients?.additionalInfo}</Form.Text>
        </Form.Group>
<br/>
        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>

      {alertMessage && <Alert variant="danger">{alertMessage}</Alert>}
    </div>
  );
};

export default DoctorRegistration;
