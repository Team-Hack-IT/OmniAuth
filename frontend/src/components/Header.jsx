import React from 'react';
import "../styles/Header.css";


const Header = () => {
    return (
        <header>
            <div className='logo'>  
                <h1>OmniAuth</h1>
            </div>

            <div className='menu'>
                <a href="#">Solutions</a>
                <a href="#">Resources</a>     
                <a href="#">Contact Us</a>
                <a href="#">About Us</a> 
            </div>

            <button>Get Started</button>

        </header>
    );
};

export default Header;