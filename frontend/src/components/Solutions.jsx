import Header from './Header.jsx';
import "../styles/Solutions.css";
import Footer from './Footer.jsx';
import Footer2 from './Footer2.jsx';

function Solutions() {
    return (

        <div>
            <Header />

            <a className="solutions_title">Our Solutions</a>

            <div className='Solution_Grid_r1'>
                <div className='Solution_box'>
                    <h2>Secure User Authentication</h2>
                    <p>Our authentication solutions leverage industry-leading techniques to verify user identities securely, including multi-factor authentication (MFA), biometric authentication, and strong password policies.
                    </p>
                    <button>Click Here</button>
                </div>               
            
                <div className='Solution_box'>
                    <h2>Phone Number Verification</h2>
                    <p>We verify the identities of users with confidence using our phone number verification service, this adds an extra layer of security to the account creation process.
                    </p>
                    <button>Click Here</button>
                </div>               
            </div>

            <div className='Solution_Grid_r1'> 
                <div className='Solution_box'>
                    <h2>ID Verification</h2>
                    <p>We ensure the authenticity and validity of user identities with our ID verification service. Our advanced verification technology analyzes government-issued IDs, passports, and driver&#39;s licenses to confirm identity documents&#39; authenticity.</p>
                    <button>Click Here</button>
                </div>               
            
                <div className='Solution_box'>
                    <h2>Unique API Key Generation</h2>
                    <p>Secure your APIs and control access to your services with our unique API key generation service.</p>
                    <button>Click Here</button>
                </div>               
            
            </div>
        
            <Footer2 />

            <Footer />
        
        </div>
    );
}

export default Solutions;