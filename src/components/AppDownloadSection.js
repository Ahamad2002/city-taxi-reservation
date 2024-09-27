import React from 'react';
import '../css/AppDownloadSection.css'; // Ensure you have this CSS file in your project

function AppDownloadSection() {
    return (
        <section className="app-download-section">
            <div className="app-content-wrapper">
                <h2 className="app-heading">Get Free Taxi App On Online Store</h2>
                <p className="app-description">
                    Competently re-engineer cross-media breed meta-services whereas best of breed processes matrix just in time content...
                </p>
                <div className="app-download-buttons">
                    <button 
                        className="download-btn google-play" 
                        aria-label="Download from Google Play">
                        Download From Google Play
                    </button>
                    <button 
                        className="download-btn app-store" 
                        aria-label="Download from App Store">
                        Download From App Store
                    </button>
                </div>
            </div>
            <div className="phone-images">
                <img 
                    src="/images/phone-image-left.png" 
                    alt="Taxiar app displayed on phone" 
                    className="phone-image"
                />
                <img 
                    src="/images/phone-image-right.png" 
                    alt="Screenshot of the Taxiar app" 
                    className="phone-image"
                />
            </div>
        </section>
    );
}

export default AppDownloadSection;
