import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Footer2 from './Footer2.jsx';

function Solutions() {
    return (

        <div>
            <Header />

            <h3 className="py-10 text-center font-bold text-2xl text-primary">Our Solutions</h3>

            <div className="flex flex-col md:grid md:grid-cols-2 gap-10 mx-10 mb-10">
                <div className='border flex flex-col items-center justify-evenly gap-8  p-10 rounded-md border-button w-[350px] mx-auto'>
                    <h2 className= 'font-semibold text-xl  text-primary'>Secure User Authentication</h2>
                    <p>Our authentication solutions leverage industry-leading techniques to verify user identities securely, including multi-factor authentication (MFA), biometric authentication, and strong password policies.
                    </p>
                    <button className='bg-button px-8 py-2 rounded-md text-white hover:bg-opacity-75'>Click Here</button>
                </div>               
            
                <div className='border flex flex-col items-center justify-evenly gap-8  p-10 rounded-md border-button w-[350px] mx-auto'>
                    <h2 className= 'font-semibold text-xl  text-primary'>Phone Number Verification</h2>
                    <p>We verify the identities of users with confidence using our phone number verification service, this adds an extra layer of security to the account creation process.
                    </p>
                    <button className='bg-button px-8 py-2 rounded-md text-white hover:bg-opacity-75'>Click Here</button>
                </div>               
        
                <div className='border flex flex-col items-center justify-evenly gap-8  p-10 rounded-md border-button w-[350px] mx-auto'>
                    <h2 className= 'font-semibold text-xl  text-primary'>ID Verification</h2>
                    <p>We ensure the authenticity and validity of user identities with our ID verification service. Our advanced verification technology analyzes government-issued IDs, passports, and driver&#39;s licenses to confirm identity documents&#39; authenticity.</p>
                    <button className='bg-button px-8 py-2 rounded-md text-white hover:bg-opacity-75'>Click Here</button>
                </div>               
            
                <div className='border flex flex-col items-center justify-evenly gap-8  p-10 rounded-md border-button w-[350px] mx-auto'>
                    <h2 className= 'font-semibold text-xl  text-primary'>Unique API Key Generation</h2>
                    <p>Secure your APIs and control access to your services with our unique API key generation service.</p>
                    <button className='bg-button px-8 py-2 rounded-md text-white hover:bg-opacity-75'>Click Here</button>
                </div>               
            
            </div>
        
            <Footer2 />

            <Footer />
        
        </div>
    );
}

export default Solutions;