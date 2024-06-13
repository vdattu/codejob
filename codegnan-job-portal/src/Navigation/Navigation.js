import React, { useState } from 'react';
import { AppBar, Toolbar, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import './Navigation.css';

const Navigation = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const [showNavLinks, setShowNavLinks] = useState(false);
  const [showBlur, setShowBlur] = useState(false);
  const userType = localStorage.getItem("userType");

  const handleClick = (location) => {
    navigate(location);
    setShowNavLinks(false);
    setShowBlur(false);
  };

  const handleToggle = () => {
    setShowNavLinks(!showNavLinks);
    setShowBlur(!showBlur);
  };

  const handleClose = () => {
    setShowNavLinks(false);
    setShowBlur(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('student_id');
    navigate("/");
  };

  // Check if the current path is /directapply
  const isDirectApply = location.pathname.includes('/directapply');

  return (
    <div className={`navigation-container ${showBlur ? 'blur' : ''}`}>
      <AppBar position="fixed" className="navbar" elevation={0}>
        <Toolbar className="tool">
          <img
            src="https://codegnan.com/wp-content/uploads/2024/02/Codegnan%E2%87%94Destination1.png"
            alt="Codegnan Logo"
            className="logo"
            onClick={() => handleClick("/")}
          />
          {!isDirectApply && (
            <div className={`nav-links ${showNavLinks ? 'show' : ''}`}>
              {userType ? (
                userType === "student" ? (
                  <>
                    <Button color="inherit" id="nav-link" onClick={() => handleClick("/jobslist")}>
                      Jobs List
                    </Button>
                    <Button color="inherit" id="nav-link" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : userType === "company" ? (
                  <>
                    <Button color="inherit" id="nav-link" onClick={() => handleClick("/addjob")}>
                      Add Jobs
                    </Button>
                    <Button color="inherit" id="nav-link" onClick={() => handleClick("/myjobs")}>
                      My Jobs
                    </Button>
                    <Button color="inherit" id="nav-link" onClick={() => handleClick("/profile")}>
                      Profile
                    </Button>
                    <Button color="inherit" id="nav-link" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : userType === "bde" ? (
                  <>
                    <Button color="inherit" id="nav-link" onClick={() => handleClick("/addjob")}>
                      Add Job
                    </Button>
                    <Button color="inherit" id="nav-link" onClick={() => handleClick("/bdedashboard")}>
                      Dashboard
                    </Button>
                    <Button color="inherit" id="nav-link" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button color="inherit" id="nav-link" onClick={() => handleClick("/login/student")}>
                      Login
                    </Button>
                    <Button color="inherit" id="nav-link" onClick={() => handleClick("/signup/student")}>
                      Signup
                    </Button>
                  </>
                )
              ) : (
                <>
                  <Button color="inherit" id="nav-link" onClick={() => handleClick("/login/student")}>
                    Login
                  </Button>
                  <Button color="inherit" id="nav-link" onClick={() => handleClick("/signup/student")}>
                    Signup
                  </Button>
                </>
              )}
              <span className="close-btn" onClick={handleClose}>X</span>
            </div>
          )}
          {!isDirectApply && (
            <button className={`toggler ${showNavLinks ? 'show' : ''}`} onClick={handleToggle}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          )}
        </Toolbar>
      </AppBar>
      {showBlur && !isDirectApply && <div className={`blur-bg ${showBlur ? 'show' : ''}`} onClick={handleClose}></div>}
    </div>
  );
};

export default Navigation;
