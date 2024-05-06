

import logo from "./logo.png";
import { Link } from 'react-router-dom';
import { Menu } from "lucide-react";
import { useState } from "react";


function Header() {
    const [showMenu, setShowMenu] = useState(false)
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };
    return (
        <>
        <header className="md:flex bg-background justify-evenly py-2 items-center hidden">
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
            

            <Link to ="/login" className="p-2 bg-button text-white rounded-md" >
                <button>Get Started</button>
            </Link>

        </header>
        <header className="bg-background flex items-center justify-between md:hidden py-2 px-3">
            {/* <div className="flex items-center gap-10"> */}
            <div className='flex h-fit items-center'>
                <img src={ logo } alt="logo" width={50} height={100} />
                <h1><Link to ="/" className="text-tertiary font-Inter font-bold" >Omni</Link></h1>
                <p><Link to ="/" className="text-black/90 font-Inter" >Auth</Link></p>
            </div>
            <div className="flex justify-end">
                <Menu size={30} onClick={toggleMenu} className="cursor-pointer transition-all duration-300"/>  
            </div>
            {/* </div> */}
        
           
        </header>
        {showMenu && (
                <div className="bg-background flex flex-col items-center gap-5 md:hidden">
                <div className='flex flex-col justify-center gap-2 items-center list-none'>
                    <li><Link to="/solutions" className="hover:text-button transition-all duration-500">Solutions</Link></li>
                    <li><Link to="/resources" className="hover:text-button transition-all duration-500">Resources</Link></li>
                    <li><Link to="/about-us" className="hover:text-button transition-all duration-500">About Us</Link></li>
                </div>
                <div className="pb-6">
                     <Link to ="/login" className="p-2 bg-button rounded-md" >
                <button>Get Started</button>
            </Link>
                </div>
                </div>
            )}
        </>
    );
}

export default Header;