import React from 'react';
import { motion } from "framer-motion";
import { FaGlobe, FaCertificate, FaUsers, FaShippingFast, FaHandshake } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-800 to-blue-600 text-white py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Global Manufacturing Excellence
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Your trusted partner for quality exports worldwide
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                About Our Company
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Established in 2005, [Company Name] has grown into a leading export-oriented manufacturer and global supplier, serving clients across 30+ countries. We specialize in [your product categories] with a commitment to quality, reliability, and competitive pricing.
              </p>
              <p className="text-lg text-gray-600">
                Our state-of-the-art manufacturing facilities span over 50,000 sq. ft, equipped with advanced machinery and operated by skilled professionals dedicated to meeting international standards.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="md:w-1/2 bg-white p-6 rounded-xl shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1581093450021-4a7360e9a9e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Manufacturing facility"
                className="rounded-lg w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Strengths */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-800 mb-16"
          >
            Why Global Clients Choose Us
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaGlobe className="h-12 w-12 text-blue-600" />,
                title: "Global Reach",
                description: "Established distribution network across 5 continents with efficient logistics solutions"
              },
              {
                icon: <FaCertificate className="h-12 w-12 text-blue-600" />,
                title: "Certified Quality",
                description: "ISO 9001, CE, RoHS certified with rigorous quality control at every production stage"
              },
              {
                icon: <FaShippingFast className="h-12 w-12 text-blue-600" />,
                title: "Reliable Supply",
                description: "Consistent on-time delivery with flexible MOQs to meet diverse client needs"
              },
              {
                icon: <FaUsers className="h-12 w-12 text-blue-600" />,
                title: "Expert Team",
                description: "100+ skilled professionals with deep industry knowledge and multilingual support"
              },
              {
                icon: <FaHandshake className="h-12 w-12 text-blue-600" />,
                title: "OEM/ODM Services",
                description: "Custom manufacturing solutions tailored to your specifications and branding"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Capabilities */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-800 mb-16"
          >
            Our Manufacturing Excellence
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Advanced Production Facilities</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>5 automated production lines with daily capacity of 50,000 units</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>In-house tooling and mold development department</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Dedicated R&D center with 15 engineers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Climate-controlled production environment</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Production line"
                className="rounded-lg w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="md:w-1/2 bg-white p-6 rounded-xl shadow-xl"
            >
              <img
                src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Quality inspection"
                className="rounded-lg w-full h-auto"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Rigorous Quality Control
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our 8-step quality assurance process ensures every product meets international standards before shipment:
              </p>
              <ol className="list-decimal pl-5 space-y-3 text-gray-600">
                <li>Raw material inspection</li>
                <li>In-process quality checks</li>
                <li>Pre-assembly testing</li>
                <li>Final product inspection</li>
                <li>Performance testing</li>
                <li>Packaging inspection</li>
                <li>Pre-shipment audit</li>
                <li>Random batch testing</li>
              </ol>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-800 mb-16"
          >
            Our Global Footprint
          </motion.h2>
          
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-3 divide-x divide-gray-200">
              {[
                { region: "Europe", countries: "Germany, France, UK, Italy, Spain" },
                { region: "North America", countries: "USA, Canada, Mexico" },
                { region: "Asia Pacific", countries: "Japan, Australia, Singapore, South Korea" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="p-8 text-center"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{item.region}</h3>
                  <p className="text-gray-600">{item.countries}</p>
                </motion.div>
              ))}
            </div>
            <div className="p-8 bg-gray-50 text-center">
              <p className="text-gray-600">Plus 15+ other markets across Middle East, Africa, and South America</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Ready to Partner With Us?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Contact our international sales team to discuss your requirements and get a competitive quote.
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition duration-300 shadow-md"
            >
              Request a Quote
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;