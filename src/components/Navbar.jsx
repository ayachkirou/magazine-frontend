import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes, FaSearch, FaUser, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef();
  const searchRef = useRef();
  const userId = localStorage.getItem("userId");

  // Fermer les dropdowns si on clique ailleurs
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target) && searchQuery === "") {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

// Dans votre Navbar, la fonction handleSearch doit être :
const handleSearch = (e) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    setSearchOpen(false);
  }
};

  const isActiveLink = (path) => {
    return location.pathname === path ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-700 hover:text-indigo-600";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              EngineTech
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/home"
              className={`px-4 py-2 font-medium transition-colors duration-300 ${isActiveLink("/home")}`}
            >
              Accueil
            </Link>
            <Link
              to="/all-articles"
              className={`px-4 py-2 font-medium transition-colors duration-300 ${isActiveLink("/all-articles")}`}
            >
              Articles & Opportunités
            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 font-medium transition-colors duration-300 ${isActiveLink("/about")}`}
            >
              À propos
            </Link>
            <Link
              to="/contact"
              className={`px-4 py-2 font-medium transition-colors duration-300 ${isActiveLink("/contact")}`}
            >
              Contact
            </Link>
              <Link
              to="/search"
              className={`px-4 py-2 font-medium transition-colors duration-300 ${isActiveLink("/search")}`}
            >
              Recherche
            </Link>
          </div>

          {/* Search and User */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative" ref={searchRef}>
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="py-1 px-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white p-1 rounded-r-md hover:bg-indigo-700 transition-colors duration-300"
                  >
                    <FaSearch size={14} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
                >
                  <FaSearch size={18} />
                </button>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FaUserCircle className="text-indigo-600" size={18} />
                </div>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm text-gray-600">Connecté en tant que</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userId ? `Utilisateur #${userId}` : "Invité"}
                    </p>
                  </div>
                  <button
                    onClick={() => { navigate("/profile"); setMenuOpen(false); }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                  >
                    <FaUser className="mr-2" size={14} />
                    Mon profil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-300"
                  >
                    <FaSignOutAlt className="mr-2" size={14} />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors duration-300"
            >
              <FaSearch size={18} />
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors duration-300"
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden py-3 px-4 border-t border-gray-200">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="flex-1 py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                autoFocus
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 rounded-r-md hover:bg-indigo-700 transition-colors duration-300"
              >
                <FaSearch size={16} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden bg-white border-t border-gray-200 transition-all duration-300 ease-in-out ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/home"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${location.pathname === "/home" ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"}`}
            onClick={() => setIsOpen(false)}
          >
            Accueil
          </Link>
          <Link
            to="/all-articles"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${location.pathname === "/all-articles" ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"}`}
            onClick={() => setIsOpen(false)}
          >
            Articles & Opportunités
          </Link>
          <Link
            to="/about"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${location.pathname === "/about" ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"}`}
            onClick={() => setIsOpen(false)}
          >
            À propos
          </Link>
          <Link
            to="/contact"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${location.pathname === "/contact" ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"}`}
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          
          <div className="pt-4 pb-2 border-t border-gray-200">
            <button
              onClick={() => { navigate("/profile"); setIsOpen(false); }}
              className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-300"
            >
              <FaUser className="mr-2" size={16} />
              Mon profil
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-100 rounded-md transition-colors duration-300"
            >
              <FaSignOutAlt className="mr-2" size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;