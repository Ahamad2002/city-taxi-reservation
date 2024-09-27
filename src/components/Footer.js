import React from 'react';
import '../css/Footer.css'; // Ensure this CSS file is correctly linked in your project

function Footer() {
    return (
        <footer className="footer">
            <section className="footer-section about-company">
                <h4>ABOUT COMPANY</h4>
                <p>Centric applications productize front end portals visualize front end list results and value added globally to simplify alternative systems without cross-platform models.</p>
                <div className="social-links">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                    <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-pinterest"></i></a>
                </div>
            </section>
            <nav className="footer-section quick-links">
                <h4>QUICK LINKS</h4>
                <ul>
                    <li><a href="/about-us">About Us</a></li>
                    <li><a href="/book-ride">Book Ride</a></li>
                    <li><a href="/feedback">Client Feedback</a></li>
                    <li><a href="/services">Our Services</a></li>
                    <li><a href="/drivers">Our Drivers</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                </ul>
            </nav>
            <section className="footer-section recent-posts">
                <h4>RECENT POSTS</h4>
                <ul>
                    <li><a href="/blog/start-car-fast">How to Start Car Engine Faster</a></li>
                    <li><a href="/blog/start-car-slow">How to Start Car Engine Slowly</a></li>
                </ul>
            </section>
            <address className="footer-section contact-details">
                <h4>CONTACT DETAILS</h4>
                <ul>
                    <li><i className="fas fa-phone"></i> +9472 399 2102</li>
                    <li><i className="fas fa-envelope"></i> info@citytaxi.com</li>
                    <li><i className="fas fa-map-marker-alt"></i> Kurunegala</li>
                </ul>
            </address>
            <div className="footer-bottom">
                © 2024 CITYTAXI. All Rights Reserved.
            </div>
        </footer>
    );
}

export default Footer;
