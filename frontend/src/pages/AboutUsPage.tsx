import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSEO } from '../hooks/useSEO';
import StructuredData from '../components/common/StructuredData';
import AboutHeroSection from '../components/about/AboutHeroSection';
import AboutHeritageSection from '../components/about/AboutHeritageSection';
import AboutValuesSection from '../components/about/AboutValuesSection';
import AboutCTASection from '../components/about/AboutCTASection';

const AboutUsPage: React.FC = () => {
  useSEO({
    title: 'About MAA DURGA PROPERTIES',
    description: 'Learn about MAA DURGA PROPERTIES and our residential, commercial, and industrial property services in Haridwar.',
    url: 'https://buildestate.vercel.app/about',
  });

  return (
    <div className="bg-white min-h-screen">
      <StructuredData type="speakable" data={{ cssSelector: ['h1', '[data-speakable]'] }} />

      {/* Sticky Navigation */}
      <Navbar />

      {/* Hero Section */}
      <AboutHeroSection />

      {/* Our Heritage Section */}
      <AboutHeritageSection />

      {/* Values Section - Driven by Purpose */}
      <AboutValuesSection />

      {/* CTA Section */}
      <AboutCTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUsPage;
