import React, { useState, useEffect } from "react";
import { Baby, Menu, X, Search, Mail, ShoppingBag } from "lucide-react";
import { useClassified } from "../../context/ClassifiedContext";
import { useMessage } from "../../context/MessageContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import DropdownMenu from "../../components/DropdownMenu";
import { PersonCircle } from "../../icons";

const Header: React.FC = () => {
  const { setSearchTerm } = useClassified();
  const { getUnreadCount } = useMessage();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const unreadCount = getUnreadCount();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchValue);
    navigate("/app");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
      style={{ maxHeight: "80px" }}
    >
      <div className="mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Baby size={28} className="text-pink-500" />
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            Baby-Go
          </span>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-pink-500 transition">
            Home
          </Link>
          <Link
            to="/app"
            className="text-gray-700 hover:text-pink-500 transition"
          >
            Browse Ads
          </Link>
          <Link
            to="/pricing"
            className="text-gray-700 hover:text-pink-500 transition"
          >
            Pricing
          </Link>
        </nav>
        {/* Search bar and Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/*   <form
            onSubmit={handleSearch}
            className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-white"
          >
            <input
              type="text"
              placeholder="Search items..."
              className="outline-none bg-transparent"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button
              type="submit"
              className="ml-2 text-gray-500 hover:text-pink-500 transition"
            >
              <Search size={18} />
            </button>
          </form> */}
        </div>

        <div className="flex items-center space-x-1">
          {user && (
            <Link
              to="/messages"
              className="relative p-2 text-gray-600 hover:text-pink-500 transition"
            >
              <Mail size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}
          <DropdownMenu userName={user?.name} onLogout={handleLogout} />
          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-lg">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/"
              className="text-gray-700 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/app"
              className="text-gray-700 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Ads
            </Link>
            <Link
              to="/pricing"
              className="text-gray-700 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
