import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">MegaMart</h2>
          <p className="text-gray-400">
            Your one-stop shop for electronics, clothing, home essentials, and
            more.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-white">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-white">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/faq" className="hover:text-white">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/returns" className="hover:text-white">
                Returns
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/help" className="hover:text-white">
                Help Center
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-white">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-white">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-white">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} MegaMart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
