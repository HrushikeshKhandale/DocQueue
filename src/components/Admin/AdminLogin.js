import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import login from "./styles/login-svgrepo-com.svg";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/api/admin/login-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: credentials.email, // Assuming admin uses email as a username
        password: credentials.password,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.authtoken) {
      // Save the auth token and redirect
      localStorage.setItem("token", json.authtoken);
      history.push("/admin-dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h2 className="regTitle">Admin Login</h2>
      <div className="container">
        <form
          className="loginForm"
          onSubmit={handleSubmit}
          style={{ position: "relative", right: "4cm" }}
        >
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Username (Email)
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
            style={{ height: "18pc", position: "relative" }}
            className="img-fluid rounded"
          />
        </div>
      </div>
      <div className="text-center mt-4">
        <p>
          Don't have an admin account?{" "}
          <Link to="/register-admin">Register here</Link>.
        </p>
      </div>
    </>
  );
};

export default AdminLogin;
