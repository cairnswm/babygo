import React from "react";
import { Baby, Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

const Footer: React.FC = () => {
  const { user, isAdmin } = useAuth();

  return (
    <footer className="bg-gray-50 mt-auto w-full mb-4">
      <div className="mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Baby size={24} className="text-pink-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                Baby-Go
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              The trusted marketplace for buying and selling second-hand baby
              goods at great prices.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-pink-500 transition"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-pink-500 transition"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-pink-500 transition"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="col-span-1">
            <h3 className="text-gray-900 font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/app"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Browse Ads
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-gray-900 font-medium mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/app"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Clothing
                </Link>
              </li>
              <li>
                <Link
                  to="/app"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Toys
                </Link>
              </li>
              <li>
                <Link
                  to="/app"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Furniture
                </Link>
              </li>
              <li>
                <Link
                  to="/app"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Strollers
                </Link>
              </li>
              <li>
                <Link
                  to="/app"
                  className="text-gray-600 hover:text-pink-500 transition"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-gray-900 font-medium mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for the latest baby items and
              promotions.
            </p>
            <form className="mb-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500 flex-1"
                />
                <button
                  type="submit"
                  className="bg-pink-500 text-white px-4 py-2 rounded-r-md hover:bg-pink-600 transition"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 mb-4 pb-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Baby-Go. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm">
            <Link
              to="/terms"
              className="text-gray-500 hover:text-pink-500 transition"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-pink-500 transition"
            >
              Privacy Policy
            </Link>
            <Link
              to="/cookies"
              className="text-gray-500 hover:text-pink-500 transition"
            >
              Cookie Policy
            </Link>
            {user && isAdmin && (
              <Link
                to="/admin/reports"
                className="text-gray-500 hover:text-pink-500 transition"
              >
                Admin Reports
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
