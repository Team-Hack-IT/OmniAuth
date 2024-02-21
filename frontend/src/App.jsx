
import './App.css'

import { Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Home from './components/Home';
import Dashboard from './pages/dashboard/Dashboard';
import { DataContext } from './context/FormContext';
import IndividualOnboarding from './pages/onboarding/IndividualOnboarding';
import Onboarding from './pages/onboarding/Onboarding';
import Verification from './pages/verification/Verification';
import IndividualVerification from './pages/login/Individual/IndividualVerification';

function App() {


  return (
 
  <Routes>
  <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<Home><Dashboard /></Home>} />
    <Route path="/onboarding" element={<Home><Onboarding /></Home>} />
    <Route path="/individual-onboarding" element={<Home><IndividualOnboarding /></Home>} />
    <Route path="/verification" element={<Home><Verification /></Home>} />
    <Route path="/individual-verification" element={<Home><IndividualVerification /></Home>} />



    
  </Routes>

  )
}

export default App