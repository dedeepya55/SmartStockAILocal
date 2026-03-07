import React from "react";
import './LandingCSS/MainLoginPageFooter.css'; // optional if using CSS file

const MainLoginPageFooter = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} SmartStockAI. All rights reserved.</p>
    </footer>
  );
};

export default MainLoginPageFooter;
