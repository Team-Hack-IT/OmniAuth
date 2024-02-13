import React from 'react';
import "../styles/Header.css";
import logo from "./logo.png";
import { Link } from 'react-router-dom';
import SignInPage from './SignInPage';
import { AuthProvider } from '@descope/react-sdk';



function Header() {
    return (
        <header>
            <div className='logo'>
                <img src={ logo } alt="logo" />
                <h1>Omni</h1>
                <p>Auth</p>
            </div>

            <div className='menu'>
                <li><Link to="/solutions">Solutions</Link></li>
                <li><Link to="/resources">Resources</Link></li>
                <li><Link to="/about-us">About Us</Link></li>
                {/* <a href="#">Solutions</a>
                <a href="#">Resources</a>
                <a href="#">About Us</a> */}
            </div>
            

            <Link to ="/signin">
                <button>Get Started</button>
            </Link>

        </header>
    );
}

export default Header;