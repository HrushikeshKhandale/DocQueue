import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import Homepage from "./components/Homepage";

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path="/register" component={RegistrationForm} />
        <Route path="/login" component={LoginForm} />
      </Switch>
    </Router>
  );
};

export default Routes;
