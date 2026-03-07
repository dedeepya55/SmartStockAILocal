import React from "react";
import "./LandingCSS/MainLoginPageFeaturesSection.css";
import image1 from "../../assets/LandinPageImage3.jpg";
import image2 from "../../assets/LandingPageImage2.jpg";
import image3 from "../../assets/LandingPageImage4.jpg";
import image4 from "../../assets/LandingPageImage5.jpg";
import image5 from "../../assets/LandingPageImage6.jpg";
import { Link } from "react-router-dom";


const featuresData = [
  {
    title: "Personalized Dashboard",
    description:
      "Track your portfolio, monitor stock movements, and access key metrics with a fully customizable AI-driven dashboard tailored to your needs.",
    image: image1,
  },
  {
    title: "Real-Time Alerts & Notifications",
    description:
      "Receive instant AI-powered notifications on significant stock movements, price alerts, and market trends to make timely investment decisions.",
    image: image2,
  },
  {
    title: "AI Stock Prediction",
    description:
      "Leverage powerful AI algorithms to forecast stock price trends, predict potential gains, and optimize your trading strategy effortlessly.",
    image: image3,
  },
  {
    title: "AI-Powered Insights & Recommendations",
    description:
      "Get actionable insights from your stock data and personalized recommendations based on market analysis and your portfolio performance.",
    image: image4,
  },
  {
    title: "Automated Reports & Analytics",
    description:
      "Generate comprehensive AI-powered reports with detailed analytics and visualizations, making it easy to track performance and progress over time.",
    image: image5,
  },
];


const MainLoginPageFeaturesSection = () => {
 return (
    <section className="features-section">
      <div className="features-header">
        <h2>Our Top Features</h2>
        <p>
          Our system makes report creation simpler by automatically detecting
          new events and generating a complete report, all just one line of
          code. No more manual work needed, let our technology take over.
        </p>
        <Link to="/login" className="get-started-btn">Get Started</Link>
      </div>

      <div className="features-grid">
        {featuresData.map((feature, index) => (
          <div key={index} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <img src={feature.image} alt={feature.title} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MainLoginPageFeaturesSection;
