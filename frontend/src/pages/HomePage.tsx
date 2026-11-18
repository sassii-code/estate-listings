import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSEO } from '../hooks/useSEO';
import StructuredData from '../components/common/StructuredData';
import HeroSection from '../components/home/HeroSection';
import TopPropertiesSection from '../components/home/TopPropertiesSection';
import PropertyCategoriesSection from '../components/home/PropertyCategoriesSection';
import HomeAboutSection from '../components/home/HomeAboutSection';

const HomePage: React.FC = () => {
  useSEO({
    title: 'Property in Haridwar',
    description: 'Buy, sell, or rent residential, commercial, and industrial property in Haridwar with MAA DURGA PROPERTIES.',
    url: 'https://buildestate.vercel.app',
  });

  return (
    <div className="min-h-screen bg-white">
      <StructuredData
        type="speakable"
        data={{ cssSelector: ['h1', '[data-speakable]'] }}
      />

      {/* Sticky Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      <TopPropertiesSection />
      <PropertyCategoriesSection />
      <HomeAboutSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;