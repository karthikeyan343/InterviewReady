import { useEffect } from "react";
import Navbar from "../component/specifiedComponent/landingPage/Navbar";
import HeroSection from "../component/specifiedComponent/landingPage/HeroSection";
import FeaturesSection from "../component/specifiedComponent/landingPage/FeaturesSection";
import LandingPageLayout from "../component/wrapperComponent/LandingPageLayout";
import HowItWorksSection from "../component/specifiedComponent/landingPage/HowItWorksSection";
import AboutUsSection from "../component/specifiedComponent/landingPage/AboutUsSection";
import Footer from "../component/specifiedComponent/landingPage/Footer";
import { ensureServerReady } from "../services/serverWakeup";

const LandingPage = () => {
  useEffect(() => {
    // Silently pre-warm the Render backend as soon as the home page loads.
    // No UI feedback here — the Navbar intercepts Login/Register clicks
    // and shows a popup only if the server hasn't responded yet.
    ensureServerReady().catch(() => {
      // Swallow — the wakeup service tracks the failed state; Navbar will
      // surface an error/retry UI if the user tries to navigate.
    });
  }, []);

  return (
    <LandingPageLayout>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection/>
      <AboutUsSection/>
      <Footer/>
    </LandingPageLayout>
  );
};

export default LandingPage;