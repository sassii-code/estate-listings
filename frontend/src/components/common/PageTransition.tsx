import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => (
  <div id="main-content" tabIndex={-1} className={className}>
    {children}
  </div>
);

export default PageTransition;
