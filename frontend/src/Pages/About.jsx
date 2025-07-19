import React from 'react';
import './CSS/Pages.css';
const About = () => {
  return (
    <div className="page-container">
      <h1>About Us</h1>
      <section>
        <h2>Our Story</h2>
        <p>How we started from humble beginnings to become industry leaders.</p>
      </section>
      <section>
        <h2>Our Values</h2>
        <ul>
          <li>Customer First</li>
          <li>Quality Excellence</li>
          <li>Sustainable Practices</li>
        </ul>
      </section>
    </div>
  );
};

export default About;