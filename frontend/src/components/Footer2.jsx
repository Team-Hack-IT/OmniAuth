
import twitterlogo from "./twitterLogo.png";
import fblogo from "./fbLogo.png";
import linkedinlogo from "./linkedinLogo.png";
import iglogo from "./igLogo.png";

const Footer2 = () => {
    return (
        <section className='bg-primary flex flex-col items-center gap-5 md:grid md:grid-cols-3 py-5 px-10'>
            <div className='text-white flex flex-col gap-2 font-thin'>
                <h3 className='text-white font-semibold'>Our Solutions</h3>
                <a href="#">Secure User Authentication</a>
                <a href="#">Phone Number Verification</a>     
                <a href="#">Unique ID Generation</a>
            </div>
            <div className='text-white flex flex-col gap-2 font-thin'>
                <h3  className='text-white font-semibold'>Resources</h3>
                <a href="#">Blog</a>
                <a href="#">Media</a>     
                <a href="#">FAQs</a>
            </div>
            <div className='FollowUs'>
                <h3  className='text-white font-semibold'>Follow Us</h3>
                <div className='text-white flex gap-2 font-thin'>
                    <img src={twitterlogo} alt="Twitter Logo" width={30} height={30}/>
                    <img src={fblogo} alt="Facebook Logo" width={30} height={30}/>
                    <img src={iglogo} alt="Instagram Logo" width={30} height={30}/>
                    <img src={linkedinlogo} alt="Linkedin Logo" width={30} height={30}/>
                </div>
            </div>



        </section>
    );
};

export default Footer2;