

import logo from "./logo.png";
import { Link } from 'react-router-dom';



function Header() {
    return (
        <header className="flex bg-background justify-evenly py-2 items-center">
            <div className='flex h-fit items-center'>
                <img src={ logo } alt="logo" width={50} height={100} />
                <h1><Link to ="/" className="text-tertiary font-Inter font-bold" >Omni</Link></h1>
                <p><Link to ="/" className="text-black/90 font-Inter" >Auth</Link></p>
            </div>

            <div className='flex justify-center gap-10 items-center    list-none'>
                <li><Link to="/solutions" className="hover:text-button transition-all duration-500">Solutions</Link></li>
                <li><Link to="/resources" className="hover:text-button transition-all duration-500">Resources</Link></li>
                <li><Link to="/about-us" className="hover:text-button transition-all duration-500">About Us</Link></li>
                {/* <a href="#">Solutions</a>
                <a href="#">Resources</a>
                <a href="#">About Us</a> */}
            </div>
            

            <Link to ="/login" className="p-2 bg-button rounded-md" >
                <button>Get Started</button>
            </Link>

        </header>
    );
}

export default Header;