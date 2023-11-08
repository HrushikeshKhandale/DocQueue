import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import healthcare from '../components/styles/health-care-doctor-svgrepo-com.svg';
import './styles/custom.css';

function Homepage() {
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
            style={{height:'18pc'}}
            className="img-fluid rounded"
          />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="text-center mt-4 " id='regCont'>
        <Link to="/register" className="btn btn-primary mr-3">
          Get Started
        </Link>
        <Link to="/login" className="btn btn-secondary ">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Homepage;
