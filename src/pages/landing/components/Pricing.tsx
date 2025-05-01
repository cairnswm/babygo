import React from "react";
import PricingPlans from "../../shared/PricingPlans";

const Pricing: React.FC = () => {
  return (
    <div className="py-20 bg-white">
      <div className="mx-auto px-4">
        <PricingPlans />
      </div>
    </div>
  );
};

export default Pricing;
