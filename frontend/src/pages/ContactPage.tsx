import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useSEO } from '../hooks/useSEO';
import StructuredData from '../components/common/StructuredData';
import ContactHeroSection from '../components/contact/ContactHeroSection';
import ContactFormCard from '../components/contact/ContactFormCard';
import ContactInfoCards from '../components/contact/ContactInfoCards';
import ContactMapSection from '../components/contact/ContactMapSection';
import FAQSection from '../components/contact/FAQSection';
import OtherWaysSection from '../components/contact/OtherWaysSection';

const FAQ_ITEMS = [
  {
    question: 'What kinds of property can I ask about?',
    answer: 'You can contact us about residential, commercial, and industrial property in Haridwar.',
  },
  {
    question: 'Can you help me buy, sell, or rent a property?',
    answer: 'Yes. Get in touch and tell us what you are looking for or what you would like to list.',
  },
  {
    question: 'How do I arrange a property visit?',
    answer: 'Contact us with the property you are interested in and we can discuss a suitable time.',
  },
  {
    question: 'How do I share a property for sale or rent?',
    answer: 'Use the Sell or Rent Out form and provide the property details so our team can follow up.',
  },
];

const ContactPage: React.FC = () => {
  useSEO({
    title: 'Contact Us',
    description: 'Contact MAA DURGA PROPERTIES about buying, selling, or renting property in Haridwar.',
    url: 'https://buildestate.vercel.app/contact',
  });

  return (
    <div className="bg-white min-h-screen">
      <StructuredData type="faqPage" data={{ faqs: FAQ_ITEMS }} />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <ContactHeroSection />

      {/* Contact Form & Info Cards Section */}
      <section className="bg-white py-16">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Contact Form (2/3 width) */}
            <div className="lg:col-span-2">
              <ContactFormCard />
            </div>

            {/* Right - Contact Info Cards (1/3 width) */}
            <div className="lg:col-span-1">
              <ContactInfoCards />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <ContactMapSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Other Ways to Connect */}
      <OtherWaysSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactPage;
