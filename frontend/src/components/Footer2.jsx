import React from 'react';
import "../styles/Footer2.css"

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
                <a href="#">Privacy</a>
                <a href="#">Term of Use</a>     
                <a href="#">Cookie Policy</a>
            </div>



        </section>
    );
};

export default Footer2;