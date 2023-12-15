// App.js
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import Homepage from "./components/Homepage";
import RegisterAs from "./components/RegisterAs";
import DoctorLogin from "./components/DoctorLogin";
import DoctorRegistration from "./components/DoctorRegistration";
import Navbar from "./components/Navbar";
import DoctorDashboard from "./components/Dashboards/DoctorDashboard";
import AdminDashboard from "./components/Dashboards/AdminDashboard";
import UserDashboard from "./components/Dashboards/UserDashboard";
import DoctorProfile from "./components/DoctorProfile";
import AppointmentBooking from "./components/Appointment/AppointmentBooking";
import BookedAppointments from "./components/Appointment/BookedAppointments";
import LoginAs from "./components/LoginAs";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminRegistration from "./components/Admin/AdminRegistration";

const App = () => {
  return (
    <Router>
      <Navbar style={{ position: 'sticky' }} />
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/as" component={RegisterAs} />
        <Route path="/register" component={RegistrationForm} />
        <Route path="/loginas" component={LoginAs} />
        <Route path="/login" component={LoginForm} />
        <Route path="/register-doctor" component={DoctorRegistration} />
        <Route path="/register-admin" component={AdminRegistration} />
        <Route path="/doctor-login" component={DoctorLogin} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/user-dashboard" component={UserDashboard} />
        <Route path="/doctor-dashboard" component={DoctorDashboard} />
        <Route path="/admin-dashboard" component={AdminDashboard} />
        <Route path="/doctor-profile/:id" component={DoctorProfile} />
        <Route path="/appointment-booking/:id" component={AppointmentBooking} />
        <Route path="/booked-appointments" component={BookedAppointments} />
      </Switch>
    </Router>
  );
};

export default App;
