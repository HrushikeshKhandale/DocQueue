import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import register from "./styles/registration-counter-register-notes-registration-svgrepo-com.svg";

const RegistrationForm = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [alertMessage, setAlertMessage] = useState(null);

  let history = useHistory();

  useEffect(() => {
    if (alertMessage) {
      setTimeout(() => {
        setAlertMessage(null);
      }, 3000); // Display the alert for 3 seconds (adjust as needed)
    }
  }, [alertMessage]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    // Clear validation messages when the user starts editing a field
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
    };

    // Validate Name
    if (credentials.name.trim() === "") {
      newErrors.name = "Name is required.";
      valid = false;
    }

    // Validate Email
    if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = "Invalid email address.";
      valid = false;
    }

    // Validate Password (add your own criteria)
    if (credentials.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      setTimeout(() => {
        setErrors({
          name: "",
          email: "",
          password: "",
        });
      }, 3000); // Clear validation messages after 3 seconds
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const response = await fetch("http://localhost:3001/api/auth/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
        }),
      });
      const json = await response.json();
      console.log(json);
      if (json) {
        // Save the auth token and redirect
        localStorage.setItem("token", json.authtoken);
        history.push("/login");
      } else {
        setAlertMessage("Invalid credentials");

        setTimeout(() => {
          setAlertMessage(null);
        }, 3000); // Clear the alert message after 3 seconds
      }
    } else {
      setAlertMessage("Please fill out the form correctly");

      setTimeout(() => {
        setAlertMessage(null);
      }, 3000); // Clear the alert message after 3 seconds
    }
  };

  return (
    <div className="container">
      <div className="col-md-6">
        {/* Healthcare-related Image */}
        <img src={register} alt="Healthcare Banner" style={{ height: "18pc",position:'relative',bottom:'12cm',left:'2cm' }} className="img-fluid rounded" />
      </div>
      <h2 className="regTitle">Register</h2>
      <form className="regForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Name"
            value={credentials.name}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.name}</div>
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.email}</div>
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />
          <div className="text-danger">{errors.password}</div>
        </div>
        <button id="regBtn" type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
      {alertMessage && <div className="alert alert-danger">{alertMessage}</div>}
    </div>
  );
};

export default RegistrationForm;
