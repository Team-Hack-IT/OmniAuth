import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Footer2 from './Footer2.jsx';
import bloglogo from './bloglogo.png';
import medialogo from './medialogo.png';
import faqlogo from './faqlogo.png';

const Resources = () => {
    return (

        <div>
            <Header />

            <h3 className="#156064 text-primary text-center py-10 font-bold text-2xl">Resources</h3>

            <div className='flex flex-col md:flex-row items-center justify-center gap-32'>           
                <div className='border border-button flex flex-col justify-evenly items-center w-[300px] min-h-[350px] px-6 rounded-md'>
                    <div className='resource_img'>
                        <img src={bloglogo}/>
                    </div>
                    <h2 className='font-semibold text-primary'>Blog</h2>
                    <p>Get valuable content, updates, tutorials, and news related to authentication, cybersecurity and related topics.
                    </p>
                    <button className='bg-button px-5 py-2 rounded-md text-white hover:bg-opacity-75'>Click Here</button>
                </div>               
            
                <div className='border border-button flex flex-col justify-evenly items-center w-[300px] min-h-[350px] px-6 rounded-md'>
                    <div className='resource_img'>
                        <img src={medialogo}/>
                    </div>
                    <h2 className='font-semibold text-primary'>Media</h2>
                    <p>Keep up with various aspects elated to multimedia content or data handling.
                    </p>
                    <button className='bg-button px-5 py-2 rounded-md text-white hover:bg-opacity-75'>Click Here</button>
                </div>     
                </div>          
            <div className='mb-10'>  
                <div className='border border-button flex flex-col justify-evenly items-center w-[300px] min-h-[350px] px-6 mx-auto mt-20 rounded-md'>
                    <div className='resource_img'>
                        <img src={faqlogo}/>
                    </div>
                    <h2 className='font-semibold text-primary'>FAQs</h2>
                    <p>Get answers on everything you need about our service.</p>
                    <button className='bg-button px-5 py-2 rounded-md text-white hover:bg-opacity-75'>Click Here</button>
                </div>   
            </div>            
            

        
            <Footer2 />

            <Footer />
        
        </div>
    );
}

export default Resources;


