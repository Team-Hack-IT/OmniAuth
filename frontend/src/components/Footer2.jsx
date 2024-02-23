import React from 'react';
import "../styles/Footer2.css"
import twitterlogo from "./twitterLogo.png";
import fblogo from "./fbLogo.png";
import linkedinlogo from "./linkedinLogo.png";
import iglogo from "./igLogo.png";

const Footer2 = () => {
    return (
        <section className='footer2'>
            <div className='OurSolutions'>
                <h1>Our Solutions</h1>
                <a href="#">Secure User Authentication</a>
                <a href="#">Phone Number Verification</a>     
                <a href="#">Unique ID Generation</a>
            </div>
            <div className='Resources'>
                <h1>Resources</h1>
                <a href="#">Blog</a>
                <a href="#">Media</a>     
                <a href="#">FAQs</a>
            </div>
            <div className='FollowUs'>
                <h1>Follow Us</h1>
                <div className='SM_logos'>
                    <img src={twitterlogo} alt="Twitter Logo"/>
                    <img src={fblogo} alt="Facebook Logo"/>
                    <img src={iglogo} alt="Instagram Logo"/>
                    <img src={linkedinlogo} alt="Linkedin Logo"/>
                </div>
            </div>



        </section>
    );
};

export default Footer2;