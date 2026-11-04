import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import PageTransition from './components/common/PageTransition';
import ScrollToTop from './components/common/ScrollToTop';
import StructuredData from './components/common/StructuredData';

// Lazy load pages for better performance (Code Splitting)
const HomePage = lazy(() => import('./pages/HomePage'));
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'));
const PropertyDetailsPage = lazy(() => import('./pages/PropertyDetailsPage'));
const OwnerEnquiryPage = lazy(() => import('./pages/OwnerEnquiryPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

function NotFoundPage() {
  return (
    <PageTransition className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F4]">
      <h1 className="font-fraunces text-6xl font-bold text-[#D4755B] mb-4">404</h1>
      <p className="font-manrope text-xl text-[#374151] mb-8">Page not found</p>
      <a href="/" className="bg-[#D4755B] text-white font-manrope font-bold px-8 py-3 rounded-lg hover:bg-[#B86851] transition-all">
        Go Home
      </a>
    </PageTransition>
  );
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F4]">
      <div className="w-12 h-12 border-4 border-[#D4755B] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      {/* Global structured data */}
      <StructuredData type="website" />
      <StructuredData type="organization" />
      <StructuredData type="localBusiness" />

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/properties" element={<PageTransition><PropertiesPage /></PageTransition>} />
          <Route path="/property/:id" element={<PageTransition><PropertyDetailsPage /></PageTransition>} />
          <Route path="/sell-property" element={<PageTransition><OwnerEnquiryPage /></PageTransition>} />
          <Route path="/about" element={<PageTransition><AboutUsPage /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <AnimatedRoutes />
      </Suspense>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}
