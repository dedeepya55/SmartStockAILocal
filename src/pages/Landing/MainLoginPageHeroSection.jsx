import React from "react";
import "./LandingCSS/MainLoginPageHeroSection.css";
import heroImage from "../../assets/LandingPageImage1.jpeg"; 
import { Link } from "react-router-dom";

const MainLoginPageHeroSection = () => {
  return (
    <div className="hero-container">
      <div className="hero-left">
        <h1 className="hero-title">
          AI-Powered Insights For Smarter Stock Decisions
        </h1>

        <p className="hero-subtitle">
          SmartStock AI helps you analyze markets, predict trends, and make
          data-driven trading decisions with ease.
        </p>

        <Link to="/login" className="hero-btn">Get Started</Link>

      </div>

      <div className="hero-right">
        <div className="hero-main-img">
          <img src={heroImage} alt="Dashboard" />
        </div>

        <div className="floating-card card-1">
         Trend Insights
        </div>

        <div className="floating-card card-2">
         AI Alerts
        </div>

        <div className="floating-card card-3">
           Stock Analysis
        </div>
      </div>
    </div>
  );
};

export default MainLoginPageHeroSection;
