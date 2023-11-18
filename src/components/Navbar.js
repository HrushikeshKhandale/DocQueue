import React from "react";
import { Link, useLocation, useHistory } from "react-router-dom";

const Navbar = () => {
  const isLoggedIn = localStorage.getItem("token");
  const location = useLocation();
  const history = useHistory();

  const handleLogout = () => {
    // Clear the authentication token from local storage
    localStorage.removeItem("token");

    // Redirect to the homepage or login page
    history.push("/");
  };

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        DocQueue
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          {isLoggedIn ? (
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <button
                  className="btn btn-link nav-link"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/user-dashboard">
                  {" "}
                  Dashboard
                </Link>
              </li>
            </ul>
          ) : (
            <>
              {!isLoginPage && (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              )}
              {!isRegisterPage && (
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
