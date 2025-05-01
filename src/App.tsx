import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import ForgotPage from "./auth/ForgotPage";
import ChangePassword from "./auth/ChangePassword";
import HomePage from "./pages/HomePage";
import ProfilePage from "./auth/pages/profile/profile";
import SystemPage from "./auth/pages/system/system";
import SubscriptionsPage from "./auth/pages/subscriptions/SubscriptionsPage";
import BuySubscriptionPage from "./auth/pages/subscriptions/BuySubscriptionPage";
import PaidSubscriptionsPage from "./auth/pages/subscriptions/PaidSubscriptionsPage";
import { useAuth } from "./auth/hooks/useAuth";
import CreateAdPage from "./pages/CreateAdPage";
import EditAdPage from "./pages/EditAdPage";
import AdDetailsPage from "./pages/AdDetailsPage";
import PricingPage from "./pages/PricingPage";
import UserRatingsPage from "./pages/UserRatingsPage";
import MessagesPage from "./pages/MessagesPage";
import MyAdvertsPage from "./pages/MyAdvertsPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import Header from "./pages/layout/Header";
import Footer from "./pages/layout/Footer";


function App() {
  const { user } = useAuth();

  useEffect(() => {
    if (window.location.hash.startsWith("#reset")) {
      const query = window.location.hash.substring(1);
      const newUrl = `${window.location.origin}/${query}`;
      window.location.href = newUrl;
    }
  }, []);

  return (
    <Router>
      <Header />
      <div className="flex flex-col bg-gray-100">
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot" element={<ForgotPage />} />
            <Route path="/#reset" element={<ChangePassword />} />
            <Route path="/reset" element={<ChangePassword />} />
            <Route path="/home" element={user ? <HomePage /> : <LoginPage />} />
            <Route
              path="/profile"
              element={user ? <ProfilePage /> : <LoginPage />}
            />
            <Route path="/system" element={<SystemPage />} />
            <Route
              path="/subscriptions"
              element={user ? <SubscriptionsPage /> : <LoginPage />}
            />
            <Route
              path="/subscriptions/buy"
              element={user ? <BuySubscriptionPage /> : <LoginPage />}
            />
            <Route
              path="/subscriptions/paid"
              element={user ? <PaidSubscriptionsPage /> : <LoginPage />}
            />

            <Route path="/create-ad" element={user ? <CreateAdPage /> : <LoginPage />} />
            <Route path="/edit-ad/:id" element={user ? <EditAdPage /> : <LoginPage />} />
            <Route path="/ad/:id" element={<AdDetailsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/user/:userId/ratings" element={<UserRatingsPage />} />
            <Route path="/messages" element={user ? <MessagesPage /> : <LoginPage />} />
            <Route path="/my-adverts" element={user ? <MyAdvertsPage /> : <LoginPage />} />
            <Route path="/admin/reports" element={user ? <AdminReportsPage /> : <LoginPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
