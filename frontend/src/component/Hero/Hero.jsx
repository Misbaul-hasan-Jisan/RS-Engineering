// Hero.js
import React from 'react';
import './Hero.css';
import hand_icon from '../Assets/hand_icon.png';
import arrow_icon from '../Assets/arrow.png';
import hero_illustration from '../Assets/hero.webp'; // You'll need to add this

const Hero = () => {
  const scrollToCollections = () => {
    const collectionsSection = document.getElementById('collections');
    if (collectionsSection) {
      collectionsSection.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <div className='hero' id='home'>
      <div className="hero-bg-shape shape-1"></div>
      <div className="hero-bg-shape shape-2"></div>
      
      <div className="hero-left">
        <div>
          <div className="hero-hand-icon">
            <p>WELCOME TO OUR WEBSITE</p>
            <img src={hand_icon} alt="Hand icon" />
          </div>
        </div>
        <div 
          className="hero-latest-button" 
          onClick={scrollToCollections}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && scrollToCollections()}
        >
          <div>Explore Now</div>
          <img src={arrow_icon} alt="Arrow icon" />
        </div>
      </div>

      <div className="hero-right">
        <img 
          src={hero_illustration} 
          alt="Fashion illustration" 
          loading="eager"
        />
      </div>
    </div>
  );
};

export default Hero;