import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'; // Import the down arrow icon
import CityTaxiNavbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import BusinessPartnershipSection from '../components/BusinessPartnershipSection';
import ServicesSection from '../components/ServicesSection';
import BookingForm from '../components/BookingForm';
import AppDownloadSection from '../components/AppDownloadSection';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import '../css/homepage.css'; // Assuming you're adding this CSS file for homepage styles

function HomePage() {
  const sections = [
    'hero-section',
    'business-partnership-section',
    'services-section',
    'booking-form-section',
    'app-download-section',
    'about-section',
    'footer-section',
  ];

  const [currentSection, setCurrentSection] = useState(0);

  const scrollToSection = (index) => {
    document.getElementById(sections[index]).scrollIntoView({ behavior: 'smooth' });
    setCurrentSection(index);
  };

  const handleScrollDown = () => {
    if (currentSection < sections.length - 1) {
      scrollToSection(currentSection + 1);
    } else {
      scrollToSection(0);
    }
  };

  return (
    <div className="homepage">
      <CityTaxiNavbar />
      <section id="hero-section">
        <HeroSection />
      </section>
      <section id="business-partnership-section">
        <BusinessPartnershipSection />
      </section>
      <section id="services-section">
        <ServicesSection />
      </section>
      <section id="booking-form-section">
        <BookingForm />
      </section>
      <section id="app-download-section">
        <AppDownloadSection />
      </section>
      <section id="about-section">
        <AboutSection />
      </section>
      <section id="footer-section">
        <Footer />
      </section>

      <button 
        className="scroll-arrow"
        onClick={handleScrollDown}
        aria-label="Scroll to next section"
      >
        {/* Font Awesome Down Arrow Icon */}
        <FontAwesomeIcon icon={faChevronDown} />
      </button>
    </div>
  );
}

export default HomePage;
