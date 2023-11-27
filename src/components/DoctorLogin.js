import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import login from "./styles/login-svgrepo-com.svg";

const DoctorLogin = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/api/doctor/doctor-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    console.log(json);
  
    if (json) {
      // Save the auth token and redirect
      localStorage.setItem("token", json.authtoken);
      history.push("/doctor-dashboard");
    } else {
      alert(`Login failed: ${json.message || "Invalid credentials"}`);
    }
  };
  

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h2 className="regTitle">Login</h2>
      <div className="container">
        <form className="loginForm" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              value={credentials.email}
              onChange={onChange}
              id="email"
              name="email"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              value={credentials.password}
              onChange={onChange}
              name="password"
              id="password"
            />
          </div>

          <button id="logBtn" type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        <div className="col-md-6" id="logImg">
          {/* Healthcare-related Image */}
          <img
            src={login}
            alt="Healthcare Login"
            style={{ height: "18pc" }}
            className="img-fluid rounded"
          />
        </div>
      </div>
    </>
  );
};

export default DoctorLogin;
