import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import healthcare from '../components/styles/health-care-doctor-svgrepo-com.svg';


const RegisterAs = () => {
  return (
    <div className="container mt-5">
      {/* Banner */}
      <div className="jumbotron text-center">
        <h1 className="display-4">Welcome to DocQueue</h1>
        <p className="lead">
          Your trusted platform for online doctor appointments.
        </p>
      </div>

      {/* Description */}
      <div className="row">
        <div className="col-md-6">
          <h2>Why Choose DocQueue?</h2>
          <ul>
            <li>Book appointments with ease</li>
            <li>Get quality healthcare</li>
            <li>Save time and avoid long waiting lines</li>
          </ul>
        </div>
        <div className="col-md-6">
          {/* Healthcare-related Image */}
          <img
            src={healthcare}
            alt="Healthcare Banner"
            style={{ height: "18pc" }}
            className="img-fluid rounded"
          />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="text-center mt-4 " id="regCont">
        <Link to="/register-doctor" className="btn btn-primary mr-3">
          As Doctor
        </Link>
        <Link to="/register" className="btn btn-secondary ">
          As User
        </Link>
      </div>
    </div>
  );
};

export default RegisterAs;
