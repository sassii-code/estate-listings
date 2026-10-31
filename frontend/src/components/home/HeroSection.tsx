import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import happyHomeowner1 from '../../images/Happy Homeowners_1.jpg';
import happyHomeowner2 from '../../images/Happy Homeowners_2.jpg';
import happyHomeowner3 from '../../images/Team section.jpg';
import rightFeatureCard from '../../images/Right side feature card.jpg';

const HeroSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const propertyImages = [
    happyHomeowner1,
    happyHomeowner2,
    happyHomeowner3,
    rightFeatureCard, 
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  return (
    <section className="relative bg-[#F8F6F6] pt-20 pb-32 overflow-hidden">
        {/* Background decorative blurs */}
        <motion.div
          animate={prefersReducedMotion ? {} : {
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: prefersReducedMotion ? 0 : Infinity,
            ease: "easeInOut" as const
          }}
          className="absolute right-0 top-14 w-64 h-64 bg-[rgba(236,70,19,0.1)] rounded-full blur-[32px]"
        />
        <motion.div
          animate={prefersReducedMotion ? {} : {
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            delay: 1,
            repeat: prefersReducedMotion ? 0 : Infinity,
            ease: "easeInOut" as const
          }}
          className="absolute left-[738px] bottom-22 w-64 h-64 bg-[rgba(254,215,170,0.2)] rounded-full blur-[32px]"
        />

        <div className="max-w-[1280px] mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Badge */}
              <motion.div variants={itemVariants} className="inline-flex items-center gap-3 bg-[rgba(212,117,91,0.1)] border border-[rgba(212,117,91,0.2)] rounded-full px-4 py-2 mb-10">
                <div className="w-2 h-2 bg-[#D4755B] rounded-full" />
                <span className="font-manrope font-bold text-xs text-[#D4755B] uppercase tracking-wider">
                  AI-Powered Real Estate
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1 data-speakable variants={itemVariants} className="font-fraunces text-[56px] lg:text-[70px] leading-[1.1] text-[#111827] mb-8">
                Discover Your<br />
                <span className="italic text-[#D4755B]">Dream Home</span>
              </motion.h1>

              {/* Description */}
              <motion.p data-speakable variants={itemVariants} className="font-manrope font-light text-xl leading-7 text-[#4b5563] mb-12 max-w-[676px]">
                Browse flats, villas, and apartments in Mumbai, Delhi, Bangalore, Ahmedabad, and Pune.
                Explore available properties and book a viewing directly through BuildEstate.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-10">
                <Link to="/properties" className="bg-[#D4755B] text-white font-manrope font-bold text-lg px-8 py-4 rounded-xl shadow-[0px_10px_15px_-3px_rgba(212,117,91,0.25),0px_4px_6px_-4px_rgba(212,117,91,0.25)] hover:bg-[#B86851] transition-all hover:shadow-xl inline-flex items-center">
                  Explore Properties
                  <span className="font-material-icons text-sm ml-2" aria-hidden="true">arrow_forward</span>
                </Link>
              </motion.div>

              {/* Social Proof */}
              <motion.div variants={itemVariants} className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <img src={propertyImages[0]} alt="" className="w-10 h-10 rounded-full border-2 border-[#f8f6f6] object-cover" />
                  <img src={propertyImages[1]} alt="" className="w-10 h-10 rounded-full border-2 border-[#f8f6f6] object-cover" />
                  <img src={propertyImages[2]} alt="" className="w-10 h-10 rounded-full border-2 border-[#f8f6f6] object-cover" />
                  <div className="w-10 h-10 bg-[#111827] rounded-full border-2 border-[#f8f6f6] flex items-center justify-center">
                    <span className="font-manrope font-bold text-xs text-white">+2k</span>
                  </div>
                </div>
                <span className="font-manrope text-sm text-[#6b7280]">
                  Join 2,000+ happy homeowners
                </span>
              </motion.div>
            </motion.div>

            {/* Property imagery without placeholder listing data */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-[0px_25px_50px_-12px_#e5e7eb]">
                <div className="relative h-[625px]">
                  <img
                    src={propertyImages[3]}
                    alt="Contemporary home exterior"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default HeroSection;
