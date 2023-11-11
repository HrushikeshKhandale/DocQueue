import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';


const DoctorRegistration = () => {
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
    hospital: '',
    hospitalAddress: '',
    contactDetails: { phone: '' },
    achievements: [],
    infoForPatients: {
      languages: [],
      patientInstructions: '',
      additionalInfo: '',
    },
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
    hospital: '',
    hospitalAddress: '',
    phone: '',
    achievements: '',
    languages: '',
    patientInstructions: '',
    additionalInfo: '',
  });

  const [alertMessage, setAlertMessage] = useState(null);

  let history = useHistory();

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 3000); // Display the alert for 3 seconds (adjust as needed)

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // If the property is nested (contains a dot), handle it accordingly
    const propertyPath = name.split('.');
    if (propertyPath.length > 1) {
      setCredentials((prevCredentials) => {
        const updatedCredentials = { ...prevCredentials };
        let currentField = updatedCredentials;
        for (let i = 0; i < propertyPath.length - 1; i++) {
          currentField = currentField[propertyPath[i]];
        }
        currentField[propertyPath[propertyPath.length - 1]] = value;
        return { ...prevCredentials, ...updatedCredentials };
      });
    } else {
      setCredentials({ ...credentials, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      specialty: '',
      hospital: '',
      hospitalAddress: '',
      phone: '',
      achievements: '',
      languages: '',
      patientInstructions: '',
      additionalInfo: '',
    };

    if (credentials.name.trim() === '') {
      newErrors.name = 'Name is required.';
      valid = false;
    }

    if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Invalid email address.';
      valid = false;
    }

    if (credentials.password.length < 5) {
      newErrors.password = 'Password must be at least 5 characters.';
      valid = false;
    }

    // Additional validations for doctor-specific fields
    if (credentials.specialty.trim() === '') {
      newErrors.specialty = 'Specialty is required.';
      valid = false;
    }

    if (credentials.hospital.trim() === '') {
      newErrors.hospital = 'Hospital is required.';
      valid = false;
    }

    if (credentials.hospitalAddress.trim() === '') {
      newErrors.hospitalAddress = 'Hospital address is required.';
      valid = false;
    }

    if (credentials.contactDetails.phone.trim() === '' || !/^\d{10,15}$/.test(credentials.contactDetails.phone)) {
      newErrors.phone = 'Valid phone number is required.';
      valid = false;
    }

    if (credentials.achievements.length === 0) {
      newErrors.achievements = 'At least one achievement is required.';
      valid = false;
    }

    if (credentials.infoForPatients.languages.length === 0) {
      newErrors.languages = 'At least one language is required.';
      valid = false;
    }

    if (credentials.infoForPatients.patientInstructions.trim() === '') {
      newErrors.patientInstructions = 'Patient instructions are required.';
      valid = false;
    }
    
    if (credentials.infoForPatients.additionalInfo.trim() === '') {
      newErrors.additionalInfo = 'Additional info is required.';
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      setTimeout(() => {
        setErrors({
          name: '',
          email: '',
          password: '',
          specialty: '',
          hospital: '',
          hospitalAddress: '',
          phone: '',
          achievements: '',
          languages: '',
          patientInstructions: '',
          additionalInfo: '',
        });
      }, 3000); // Clear validation messages after 3 seconds
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Additional logic for Doctor Registration
      try {
        const response = await fetch('http://localhost:3001/api/register-doctor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
        const json = await response.json();
        console.log(json);

        if (json.authtoken) {
          // Save the auth token and redirect
          localStorage.setItem('token', json.authtoken);
          history.push('/dashboard'); // Change the route as needed
        } else {
          setAlertMessage('Invalid credentials');

          setTimeout(() => {
            setAlertMessage(null);
          }, 3000); // Clear the alert message after 3 seconds
        }
      } catch (error) {
        console.error(error.message);
        setAlertMessage('Error during registration. Please try again.');
      }
    } else {
      setAlertMessage('Please fill out the form correctly');

      setTimeout(() => {
        setAlertMessage(null);
      }, 3000); // Clear the alert message after 3 seconds
    }
  };

  return (
    <>
        {alertMessage && <div style={{position:'sticky',width:'100vw',top:0,zIndex:1}} className="alert alert-danger">{alertMessage}</div>}
    <div className="container">
      <h2 className="regTitle">Doctor Registration</h2>
      <form className="regForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            placeholder="Name"
            value={credentials.name}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.name}</div>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.email}</div>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.password}</div>
        </div>
        <div className="form-group">
          <label htmlFor="specialty">Specialty</label>
          <input
            type="text"
            id="specialty"
            name="specialty"
            className="form-control"
            placeholder="Specialty"
            value={credentials.specialty}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.specialty}</div>
        </div>
        <div className="form-group">
          <label htmlFor="hospital">Hospital</label>
          <input
            type="text"
            id="hospital"
            name="hospital"
            className="form-control"
            placeholder="Hospital"
            value={credentials.hospital}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.hospital}</div>
        </div>
        <div className="form-group">
          <label htmlFor="hospitalAddress">Hospital Address</label>
          <input
            type="text"
            id="hospitalAddress"
            name="hospitalAddress"
            className="form-control"
            placeholder="Hospital Address"
            value={credentials.hospitalAddress}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.hospitalAddress}</div>
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="contactDetails.phone"
            className="form-control"
            placeholder="Phone"
            value={credentials.contactDetails.phone}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.phone}</div>
        </div>
        <div className="form-group">
          <label htmlFor="achievements">Achievements</label>
          <input
            type="text"
            id="achievements"
            name="achievements"
            className="form-control"
            placeholder="Achievements"
            value={credentials.achievements}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.achievements}</div>
        </div>
        <div className="form-group">
          <label htmlFor="languages">Languages</label>
          <input
            type="text"
            id="languages"
            name="infoForPatients.languages"
            className="form-control"
            placeholder="Languages"
            value={credentials.infoForPatients.languages}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.languages}</div>
        </div>
        <div className="form-group">
          <label htmlFor="patientInstructions">Patient Instructions</label>
          <textarea
            id="patientInstructions"
            name="infoForPatients.patientInstructions"
            className="form-control"
            placeholder="Patient Instructions"
            value={credentials.infoForPatients.patientInstructions}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.patientInstructions}</div>
        </div>
        <div className="form-group">
          <label htmlFor="additionalInfo">Additional Info</label>
          <textarea
            id="additionalInfo"
            name="infoForPatients.additionalInfo"
            className="form-control"
            placeholder="Additional Info"
            value={credentials.infoForPatients.additionalInfo}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.additionalInfo}</div>
        </div>
        <button id="regBtn" type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
    </>
  );
};

export default DoctorRegistration;
