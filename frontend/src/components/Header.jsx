
import "../styles/Header.css";
import logo from "./logo.png";
import { Link } from 'react-router-dom';



function Header() {
    return (
        <header>
            <div className='logo'>
                <img src={ logo } alt="logo" />
                <h1><Link to ="/homepage" style={{textDecoration:'none',color:'inherit'}}>Omni</Link></h1>
                <p><Link to ="/homepage" style={{textDecoration:'none',color:'inherit'}}>Auth</Link></p>
            </div>

            <div className='menu'>
                <li><Link to="/solutions">Solutions</Link></li>
                <li><Link to="/resources">Resources</Link></li>
                <li><Link to="/about-us">About Us</Link></li>
                {/* <a href="#">Solutions</a>
                <a href="#">Resources</a>
                <a href="#">About Us</a> */}
            </div>
            

            <Link to ="/login" style={{textDecoration:'none',color:'inherit'}}>
                <button>Get Started</button>
            </Link>

        </header>
    );
}

export default Header;