import React from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, delay = 0, className = '' }) => {
  return (
    <div className={className} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
};

export default ScrollReveal;
