import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import Homepage from "./components/Homepage";
import RegisterAs from "./components/RegisterAs"; // Assuming this is the correct path
import DoctorLogin from "./components/DoctorLogin";
import DoctorRegistration from "./components/DoctorRegistration";
import Navbar from "./components/Navbar";
import DoctorDashboard from "./components/Dashboards/DoctorDashboard";
import UserDashboard from "./components/Dashboards/UserDashboard";

const Routes = () => {
  return (
    <Router>
      <Navbar style={{ position: 'sticky' }} />
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/as" component={RegisterAs} />
        <Route path="/register" component={RegistrationForm} />
        <Route path="/login" component={LoginForm} />
        <Route path="/register-doctor" component={DoctorRegistration} />
        <Route path="/doctor-login" component={DoctorLogin} />
        <Route path="/user-dashboard" component={UserDashboard} />
        <Route path="/doctor-dashboard" component={DoctorDashboard} />
      </Switch>
    </Router>
  );
};

export default Routes;
