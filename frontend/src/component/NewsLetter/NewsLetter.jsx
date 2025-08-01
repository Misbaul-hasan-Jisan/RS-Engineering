import React, { useState } from 'react';
import './NewsLetter.css';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setSubmitted(false);
      return;
    }

    setError('');
    setSubmitted(true);

    // Simulate sending the email to a server
    console.log("Subscribed with:", email);

    // Optionally reset
    setEmail('');
  };

  return (
    <section className='newsletter'>
      <h1>Get Exclusive Offers In Your Inbox</h1>
      <p>Subscribe to our newsletter and stay updated</p>

      <form onSubmit={handleSubmit} className='newsletter-form'>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
          required
        />
        <button type="submit">Subscribe</button>
      </form>

      {error && <p className="newsletter-error">{error}</p>}
      {submitted && <p className="newsletter-success">Thank you for subscribing!</p>}
    </section>
  );
};

export default NewsLetter;
