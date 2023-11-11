import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import login from "./styles/login-svgrepo-com.svg";

const LoginForm = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/api/auth/login", {
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
    if (json.success) {
      // Save the auth token and redirect
      localStorage.setItem("token", json.authtoken);
      history.push("/user-dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h2 className="loginTitle">Login</h2>
<div className="container">

      <form  className="loginForm" onSubmit={handleSubmit} style={{position:'relative',bottom:'12cm',}}>
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
      style={{height:'18pc',position:'relative',bottom:'12cm',}}
      className="img-fluid rounded"
    />
      </div>
</div>
    </>
  );
};

export default LoginForm;
