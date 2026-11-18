import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import PageTransition from './components/common/PageTransition';
import ScrollToTop from './components/common/ScrollToTop';
import StructuredData from './components/common/StructuredData';
import GlobalContactBar from './components/common/GlobalContactBar';
import Navbar from './components/common/Navbar';

// Lazy load pages for better performance (Code Splitting)
const HomePage = lazy(() => import('./pages/HomePage'));
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'));
const PropertyDetailsPage = lazy(() => import('./pages/PropertyDetailsPage'));
const OwnerEnquiryPage = lazy(() => import('./pages/OwnerEnquiryPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

function NotFoundPage() {
  return (
    <PageTransition className="min-h-screen bg-[#EEF0EC]">
      <Navbar />
      <main className="flex min-h-[70vh] flex-col items-center justify-center">
      <h1 className="mb-4 text-6xl font-bold text-[#0F5E5A]">404</h1>
      <p className="mb-8 text-xl text-[#2E3A3F]">Page not found</p>
      <a href="/" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#0F5E5A] px-8 py-3 font-bold text-white">
        Go Home
      </a>
      </main>
    </PageTransition>
  );
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#EEF0EC]">
      <Navbar />
      <div role="status" className="flex min-h-[60vh] items-center justify-center text-lg text-[#2E3A3F]">
        Loading page…
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  return (
    <>
      {/* Global structured data */}
      <StructuredData type="website" />
      <StructuredData type="organization" />
      <StructuredData type="localBusiness" />

      <Routes>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/properties" element={<PageTransition><PropertiesPage /></PageTransition>} />
        <Route path="/property/:id" element={<PageTransition><PropertyDetailsPage /></PageTransition>} />
        <Route path="/sell-property" element={<PageTransition><OwnerEnquiryPage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutUsPage /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
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
      <GlobalContactBar />
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}
