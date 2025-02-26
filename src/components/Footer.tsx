import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">
              Timor Pacific Logistics is your trusted partner for air travel and cargo services in East Timor and across the Pacific region.
            </p>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Book Flight</a></li>
              <li><a href="#" className="hover:text-white">Book Cargo</a></li>
              <li><a href="#" className="hover:text-white">Track Shipment</a></li>
              <li><a href="#" className="hover:text-white">Flight Schedule</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +670 123 456 789
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                info@timorpacific.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Dili, East Timor
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Timor Pacific Logistics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}