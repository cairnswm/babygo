import React from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import { accessElf } from '../../auth/utils/accessElf';

const LandingPage: React.FC = () => {
  accessElf.track('Landing Page');
  return (
    <div>
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default LandingPage;