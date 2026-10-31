import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/properties', label: 'Properties' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0.8, 0.95]);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
    {/* Skip-to-main-content — keyboard accessibility */}
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#D4755B] focus:text-white focus:font-manrope focus:font-bold focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
    >
      Skip to main content
    </a>
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ backgroundColor: `rgba(255, 255, 255, ${bgOpacity.get()})` }}
      className="sticky top-0 z-50 border-b border-[#E6D5C3] backdrop-blur-md"
    >
      <div className="max-w-[1280px] mx-auto px-8 flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0" onClick={closeMobileMenu}>
          <img src="/logo.png" alt="BuildEstate" width="36" height="36" className="h-9 w-auto" />
          <span className="font-fraunces text-2xl font-bold text-[#111827]">BuildEstate</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-manrope transition-[color] ${
                isActive(link.path)
                  ? 'text-[#D4755B] font-semibold'
                  : 'text-[#374151] hover:text-[#D4755B]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-[#374151] hover:text-[#D4755B] transition-[color]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <span className="font-material-icons text-2xl" aria-hidden="true">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-[#E6D5C3] shadow-lg py-4 px-8 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-manrope text-base py-2.5 transition-[color] ${
                isActive(link.path) ? 'text-[#D4755B] font-semibold' : 'text-[#374151]'
              }`}
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          ))}

        </div>
      )}
    </motion.nav>
    </>
  );
};

export default Navbar;
