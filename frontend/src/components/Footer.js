import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

export default function Footer() {
  return (
    <div className="footer">
      <div className="footer-sections">
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: support@emohealth.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>

        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">🌐</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">🐦</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">💼</a>
          </div>
        </div>
      </div>

     
      <hr className="footer-line" />

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} EmoHealth Nexus | All Rights Reserved</p>
      </div>
    </div>
  );
}
