
import './App.css'

import { Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Home from './components/Home';
import Dashboard from './pages/dashboard/Dashboard';
import IndividualOnboarding from './pages/onboarding/IndividualOnboarding';
import Onboarding from './pages/onboarding/Onboarding';
import Verification from './pages/verification/Verification';
import IndividualVerification from './pages/Individual/IndividualVerification';
import NotFoundPage from './pages/Error/404Page';
import GenerateKey from './pages/dashboard/GenerateKey';
import Protected from './components/Protected';
import Logout from './pages/logout/Logout';
import LandingPage from './pages/landingpage/LandingPage';
import Solutions from './components/Solutions';
import Resources from './components/Resources';
import About from './components/About';

function App() {


  return (
 
  <Routes>
  <Route path="/*" element={<NotFoundPage />} />
  <Route path="/" element={<LandingPage/>} />
  <Route path="/solutions" element={<Solutions />} />
  <Route path="/resources" element={<Resources />} />
  <Route path="/about-us" element={<About />} />
  {/* <Route path="/resources" element={</>} /> */}

    <Route path="/login" element={<Login />} />
   
    <Route element={<Protected/>} >
    <Route path="/dashboard" element={<Home><Dashboard /></Home>} />
    <Route path="/onboarding" element={<Home><Onboarding /></Home>} />
    <Route path="/individual-onboarding" element={<Home><IndividualOnboarding /></Home>} />
    <Route path="/verification" element={<Home><Verification /></Home>} />
    <Route path="/individual-verification" element={<Home><IndividualVerification /></Home>} />
    <Route path="/generate-key" element={<Home><GenerateKey /></Home>} />
    <Route path="/logout" element={<Home><Logout /></Home>} />

    </Route>


    
  </Routes>

  )
}

export default App
