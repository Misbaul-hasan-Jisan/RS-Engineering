import React, { useState } from 'react';
import './CSS/Pages.css';
import { FaMapMarkerAlt, FaClock, FaPhone, FaStore } from 'react-icons/fa';

const Stores = () => {
  const [activeStore, setActiveStore] = useState(0);
  
  const locations = [
    { 
      city: 'Khilkhet', 
      address: 'Uttarpara, Dhaka', 
      hours: '9:00 AM - 9:00 PM',
      phone: '+880 1234 567890',
      coordinates: '23.8305,90.4276' // Latitude, Longitude for maps
    },
    // Add more locations as needed
  ];

  const handleGetDirections = (coords) => {
    // Open Google Maps with the coordinates
    window.open(`https://www.google.com/maps?q=${coords}`, '_blank');
  };

  return (
    <div className="page-container">
      <h1 className="page-title">
        <FaStore className="icon" /> Our Stores
      </h1>
      
      <div className="store-locations">
        {locations.map((store, index) => (
          <div 
            key={index} 
            className={`store-card ${index === activeStore ? 'active' : ''}`}
            onClick={() => setActiveStore(index)}
          >
            <h3 className="store-city">
              <FaMapMarkerAlt className="icon" /> {store.city}
            </h3>
            
            <div className="store-details">
              <p className="store-address">{store.address}</p>
              
              <p className="store-hours">
                <FaClock className="icon" /> {store.hours}
              </p>
              
              <p className="store-phone">
                <FaPhone className="icon" /> {store.phone}
              </p>
            </div>
            
            <button 
              className="direction-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleGetDirections(store.coordinates);
              }}
            >
              Get Directions
            </button>
          </div>
        ))}
      </div>

      {/* Map placeholder - you can integrate Google Maps API here */}
      <div className="store-map">
        <iframe
          title="Store Location"
          width="100%"
          height="400"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={`https://maps.google.com/maps?q=${locations[activeStore].coordinates}&z=15&output=embed`}
        >
        </iframe>
      </div>
    </div>
  );
};

export default Stores;