import React from "react";
import { Link } from "react-router-dom";
import footer_logo from "../Assets/logo_big.png";
import instagram_icon from "../Assets/instagram_icon.png";
import pinterest_icon from "../Assets/pinterest_icon.png";
import whatsapp_icon from "../Assets/whatsapp_icon.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <img
                src={footer_logo}
                alt="Shopper Logo"
                className="h-12 w-auto"
              />
              <p className="text-2xl font-bold text-indigo-400">SHOPPER</p>
            </div>
            <p className="text-gray-400 text-center md:text-left max-w-md">
              Your premier destination for quality products and exceptional
              shopping experiences.
            </p>
          </div>

          {/* Links Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4 text-indigo-300">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3 w-full">
              <li className="w-full text-center md:text-left">
                <Link
                  to="/company"
                  className="block text-gray-300 hover:text-indigo-400 transition-colors py-1"
                >
                  Company
                </Link>
              </li>
              <li className="w-full text-center md:text-left">
                <Link
                  to="/store"
                  className="block text-gray-300 hover:text-indigo-400 transition-colors py-1"
                >
                  Stores
                </Link>
              </li>
              <li className="w-full text-center md:text-left">
                <Link
                  to="/about"
                  className="block text-gray-300 hover:text-indigo-400 transition-colors py-1"
                >
                  About
                </Link>
              </li>
              <li className="w-full text-center md:text-left">
                <Link
                  to="/contact"
                  className="block text-gray-300 hover:text-indigo-400 transition-colors py-1"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          {/* Social Media Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4 text-indigo-300">
              Connect With Us
            </h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="bg-gray-800 hover:bg-indigo-600 p-3 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <img src={instagram_icon} alt="Instagram" className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-indigo-600 p-3 rounded-full transition-colors"
                aria-label="Pinterest"
              >
                <img src={pinterest_icon} alt="Pinterest" className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-indigo-600 p-3 rounded-full transition-colors"
                aria-label="WhatsApp"
              >
                <img src={whatsapp_icon} alt="WhatsApp" className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400">
            Copyright © 2025 Shopper - All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
