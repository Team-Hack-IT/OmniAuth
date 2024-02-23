import React from 'react';
import Header from './Header.jsx';
import "../styles/Resources.css";
import Footer from './Footer.jsx';
import Footer2 from './Footer2.jsx';
import bloglogo from './bloglogo.png';
import medialogo from './medialogo.png';
import faqlogo from './faqlogo.png';

function Solutions() {
    return (

        <div>
            <Header />

            <a className="resources_title">Resources</a>

            <div className='Resources_Grid_r1'>           
                <div className='Resource_box'>
                    <div className='resource_img'>
                        <img src={bloglogo}/>
                    </div>
                    <h2>Blog</h2>
                    <p>Get valuable content, updates, tutorials, and news related to authentication, cybersecurity and related topics.
                    </p>
                    <button>Click Here</button>
                </div>               
            
                <div className='Resource_box'>
                    <div className='resource_img'>
                        <img src={medialogo}/>
                    </div>
                    <h2>Media</h2>
                    <p>Keep up with various aspects elated to multimedia content or data handling.
                    </p>
                    <button>Click Here</button>
                </div>     
                </div>          
            <div className='Resources_Grid_r1'>  
                <div className='Resource_box'>
                    <div className='resource_img'>
                        <img src={faqlogo}/>
                    </div>
                    <h2>FAQs</h2>
                    <p>Get answers on everything you need about our service.</p>
                    <button>Click Here</button>
                </div>   
            </div>            
            

        
            <Footer2 />

            <Footer />
        
        </div>
    );
}

export default Solutions;