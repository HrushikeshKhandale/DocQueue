import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const RegistrationForm = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
  });

  let history = useHistory();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/api/auth/createuser", {
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
      alert("Invalid credentials");
    }
  };
  

  const handleChange = (e) => {
    setCredentials({...credentials, [e.target.name]: e.target.value})
  };
  
  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Name"
            value={credentials.name}
            onChange={handleChange}
          />
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
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
