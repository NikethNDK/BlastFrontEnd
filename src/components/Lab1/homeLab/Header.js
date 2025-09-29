import React, { useState, useEffect } from 'react';
// Assuming these imports are defined in your original file:
import TN_Transparent_Logo from "../../../assets/TN_Transparent_Logo.png";
import leftLogo from "../../../assets/elephant.png";
import AWIC_INTRANET from "../../../assets/AIWC_INTRANET.png";
import AIWC_LIMS from "../../../assets/AIWC_LIMS.png";
import AIWC_DNA_sequencing from "../../../assets/AIWC_DNA_sequencing.png"
// import { useNavigate } from 'react-router-dom'; 
import './Header.css'; // Link to the modern CSS file

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    // Add scroll effect for additional visual feedback
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <header className={`modern-header ${isScrolled ? 'scrolled' : ''}`} >
            {/* --- Left Logo Group --- */}
            <div className="header-column logo-column">
                <img 
                    src={TN_Transparent_Logo} 
                    alt="Tamil Nadu Government Logo" 
                    className="logo tn-logo"
                    loading="lazy"
                />
                <img 
                    src={leftLogo} 
                    alt="Wildlife Conservation Emblem" 
                    className="logo emblem-logo"
                    loading="lazy"
                />
            </div>

            {/* --- Center Title Group --- */}
            <div className="header-column title-column">
                <div className="title-group">
                    <h1 className="main-title">
                        Advanced Institute for Wildlife Conservation
                    </h1>
                    
                    <p className="subtitle light-text">
                        Research, Training and Education
                    </p>
                    
                    <p className="subtitle dark-text">
                        Tamil Nadu Forest Department
                    </p>
                    
                    <p className="address-text">
                        Vandalur, Chennai - 600048
                    </p>
                    
                    <div className="lims-bar">
                        <h2 className="lims-text">
                            Laboratory Information Management System
                        </h2>
                    </div>
                </div>
            </div>

            {/* --- Right Logo Group --- */}
            <div className="header-column logo-column right-logos">
                <img 
                    src={AIWC_LIMS} 
                    alt="AIWC LIMS System Logo" 
                    className="logo lims-logo"
                    loading="lazy"
                />
                <img 
                    src={AIWC_DNA_sequencing} 
                    alt="DNA Sequencing Laboratory Logo" 
                    className="logo dna-logo"
                    loading="lazy"
                />
            </div>
        </header>
    );
};

export default Header;