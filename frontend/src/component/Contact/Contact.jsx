import React, { useState } from 'react';
import { FiSend, FiMail, FiArrowRight } from 'react-icons/fi';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Replace with your actual Formspree endpoint
      const response = await fetch('https://formspree.io/f/xyzjaqng', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          _subject: 'New message from your portfolio!',
          _replyto: formData.email
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <section className="contact section" id="contact">
      <h2 className="section__title">Contact Me</h2>
      
      <div className="contact__container container grid">
        <div className="contact__content">
          <h3 className="contact__title">Talk to me</h3>
          
          <div className="contact__info">
            <div className="contact__card">
              <FiMail className="contact__card-icon" />
              <h3 className="contact__card-title">Email</h3>
              <span className="contact__card-data">abcsaifulislam66@gmail.com</span>
              <a href="mailto:abcsaifulislam66@gmail.com" className="contact__button">
                Write me <FiArrowRight className="contact__button-icon" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="contact__content">
          <h3 className="contact__title">Write me your message</h3>
          
          <form onSubmit={handleSubmit} className="contact__form">
            <div className="contact__form-div">
              <label className="contact__form-tag">Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required 
                className="contact__form-input" 
                placeholder="Your name"
              />
            </div>
            
            <div className="contact__form-div">
              <label className="contact__form-tag">Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required 
                className="contact__form-input" 
                placeholder="Your email"
              />
            </div>
            
            <div className="contact__form-div contact__form-area">
              <label className="contact__form-tag">Message</label>
              <textarea 
                name="message" 
                value={formData.message}
                onChange={handleChange}
                required 
                cols="30" 
                rows="10" 
                className="contact__form-input" 
                placeholder="Your message"
              ></textarea>
            </div>
            
            <input type="text" name="_gotcha" style={{display: 'none'}} />
            
            <button 
              type="submit" 
              className="button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : (
                <>
                  Send Message <FiSend className="button__icon" />
                </>
              )}
            </button>

            {submitStatus === 'success' && (
              <div className="contact__success">
                Message sent successfully!
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="contact__error">
                Failed to send message. Please try again.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;