import React from 'react';
import "../styles/Feature.css"

const Feature = () => {
    return (
        <section className='feature'>
            <h3>What We Offer</h3>
            <h4>We provide comprehensive identiy management solution to users</h4>
            <div className='FeatureBox'>
                <div className='FeatureBox_txt'>
                    <h5>Secure User Authentication</h5>
                    <h6>User Authentication ensures user identity verification</h6>
                </div> 
                <div className='FeatureBox_img'>
                    <img src="#"></img>  
                </div>
            </div>

            <div className='FeatureBox'>
                <div className='FeatureBox_img'>
                    <img src="#"></img>  
                </div>
                <div className='FeatureBox_txt'>
                    <h5>ID Verification</h5>
                    <h6>Compares the identity of a person claims to possess with date that proves it</h6>
                </div> 

            </div>

            <div className='FeatureBox'>
                <div className='FeatureBox_txt'>
                    <h5>Phone Number Verification</h5>
                    <h6>Verifying phone number reduces the risk of fraudulent activities</h6>
                </div> 
                <div className='FeatureBox_img'>
                    <img src="#"></img>  
                </div>
            </div>

            <div className='FeatureBox'>
                <div className='FeatureBox_img'>
                    <img src="#"></img>  
                </div>
                <div className='FeatureBox_txt'>
                    <h5>Unique ID Generation</h5>
                    <h6>User Authentication ensures user identiy verification</h6>
                </div> 

            </div>

            <div className='FeatureBox'>
                <div className='FeatureBox_txt'>
                    <h5>User-Friendly Dashboard</h5>
                    <h6>User Authentication ensures user identiy verification</h6>
                </div> 
                <div className='FeatureBox_img'>
                    <img src="#"></img>  
                </div>
            </div>

        </section>
    );
};

export default Feature;
