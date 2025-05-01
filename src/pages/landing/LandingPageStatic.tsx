import React from "react";
import LandingPage from "./LandingPage";
import { MemoryRouter  } from "react-router-dom";

if (typeof window === "undefined") {
  // @ts-ignore
  React.useLayoutEffect = React.useEffect;
}

const LandingPageStatic: React.FC = () => {
  return (
    <MemoryRouter >
      <LandingPage />
    </MemoryRouter >
  );
};

export default LandingPageStatic;
