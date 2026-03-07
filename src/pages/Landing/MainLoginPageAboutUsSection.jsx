import React from "react";
import './LandingCSS/MainLoginPageAboutUsSection.css';

const MainLoginPageAboutUsSection = () => {
  return (
     <div className="about-container">
      <h1 className="about-title">About Us</h1>
      <div className="cards-container">
        <div className="card">
          <h2>Our Vision</h2>
          <p>
            To revolutionize stock trading using AI technology, making investing
            accessible, smart, and insightful for everyone.
          </p>
        </div>
        <div className="card">
          <h2>Our Mission</h2>
          <p>
            To empower users with real-time data, predictive analytics, and
            intelligent recommendations for better investment decisions.
          </p>
        </div>
        <div className="card">
          <h2>Our Objective</h2>
          <p>
            To create a platform that blends technology and finance, ensuring
            secure, efficient, and user-friendly experiences for traders of all levels.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainLoginPageAboutUsSection;
