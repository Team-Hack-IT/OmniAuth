
import './App.css'
import Header from './components/Header.jsx';
import Summary from './components/Summary.jsx';
import Feature from './components/Feature.jsx';
import Connect from './components/Connect.jsx';
import Footer from './components/Footer.jsx';
import Footer2 from './components/Footer2.jsx';
import { AuthProvider } from '@descope/react-sdk';




function App() {

  return (
    <AuthProvider projectId='P2bMT7le7rEj4uL9gVKZpK9Kd6Md'>
      <>
        <Header />

        <Summary />

        <Feature />

        <Connect />

        <Footer2 />

        <Footer />
      </>
    </AuthProvider>  
  )
}

export default App
