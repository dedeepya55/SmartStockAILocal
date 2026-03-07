import React from "react";
import MainLoginPageHeader from "./MainLoginPageHeader";
import MainLoginPageHeroSection from "./MainLoginPageHeroSection";
import MainLoginPageAboutUsSection from "./MainLoginPageAboutUsSection";
import MainLoginPageFeaturesSection from "./MainLoginPageFeaturesSection";
import MainLoginPageStatsSection from "./MainLoginPageStatsSection";
import MainLoginPageFooter from "./MainLoginPageFooter";

const LandingPage = () => {
  return (
   <>
  <MainLoginPageHeader />

  <section id="hero">
    <MainLoginPageHeroSection />
  </section>

  <section id="about">
    <MainLoginPageAboutUsSection />
  </section>

  <section id="features">
    <MainLoginPageFeaturesSection />
  </section>

  <section id="users">
    <MainLoginPageStatsSection />
  </section>

  <MainLoginPageFooter />
</>

  );
};

export default LandingPage;