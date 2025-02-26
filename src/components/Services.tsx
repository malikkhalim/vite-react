import React from 'react';
import { Plane, Package, Clock, MapPin } from 'lucide-react';

const services = [
  {
    icon: <Plane className="h-8 w-8" />,
    title: "Passenger Flights",
    description: "Direct flights to East Timor with comfortable seating and excellent service"
  },
  {
    icon: <Package className="h-8 w-8" />,
    title: "Cargo Services",
    description: "Reliable cargo transportation with real-time tracking and secure handling"
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Express Delivery",
    description: "Fast and efficient delivery services for time-sensitive shipments"
  },
  {
    icon: <MapPin className="h-8 w-8" />,
    title: "Multiple Destinations",
    description: "Connecting East Timor with major cities across the Pacific region"
  }
];

export default function Services() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive aviation and logistics solutions tailored to meet your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-sky-600 mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}