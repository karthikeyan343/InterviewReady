import Navbar from "../component/specifiedComponent/landingPage/Navbar";
import HeroSection from "../component/specifiedComponent/landingPage/HeroSection";
import FeaturesSection from "../component/specifiedComponent/landingPage/FeaturesSection";
import LandingPageLayout from "../component/wrapperComponent/LandingPageLayout";
import HowItWorksSection from "../component/specifiedComponent/landingPage/HowItWorksSection";
import AboutUsSection from "../component/specifiedComponent/landingPage/AboutUsSection";
import Footer from "../component/specifiedComponent/landingPage/Footer";

const LandingPage = () => {
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