import React from 'react';
import PricingPlans from './shared/PricingPlans';
import { accessElf } from '../auth/utils/accessElf';

const PricingPage: React.FC = () => {
  accessElf.track('Pricing Page');
  return (
    <div className="py-20">
      <PricingPlans />
    </div>
  );
};

export default PricingPage;