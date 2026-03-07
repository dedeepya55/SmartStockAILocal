import React, { useState } from "react";
import "./LandingCSS/MainLoginPageHeader.css";
import { Link } from "react-router-dom";

const MainLoginPageHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="header-container">
      <div className="logo">SmartStockAI</div>

      <nav className={`nav-links ${open ? "nav-active" : ""}`}>
        <a href="#about">About</a>
        <a href="#features">Features</a>
        <a href="#users">Users</a>
        <Link to="/login" className="login-btn">Login</Link>
      </nav>

      <div className="hamburger" onClick={() => setOpen(!open)}>
        <span className={open ? "line open" : "line"}></span>
        <span className={open ? "line open" : "line"}></span>
        <span className={open ? "line open" : "line"}></span>
      </div>
    </header>
  );
};

export default MainLoginPageHeader;
