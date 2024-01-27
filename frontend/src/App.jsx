
import './App.css'

function App() {

  return (
    <> 
      <header>
        <div className='logo'>  
          <h1>OmniAuth</h1>
        </div>

        <div className='menu'>
          <a href="#">Solutions</a>
          <a href="#">Resources</a>     
          <a href="#">Contact Us</a>
          <a href="#">About Us</a> 
        </div>

        <div className='GetStartedButton'>
          <a href="#">Get Started</a>
        </div> 

      </header>

      <main>
        <div>
          <h2>Guaranteed robust and secure identiy management platform for users</h2>
          <p>We ensure the highest level of security for user authentication and data management</p>
          <div className='SignInButton'>
            <a href="#">Sign In</a>
          </div>  
        </div> 

        <div>
          <img src="#"></img>  
        </div>

      </main>

      <feature>
          <h2>What We Offer</h2>
          <p>We provide comprehensive identiy management solution to users</p>
      </feature>

      <footer>
          <a href="#">Privacy</a>
          <a href="#">Term of Use</a>     
          <a href="#">Cookie Policy</a>
          <a href="#">OmniAuth@2024. All Rights Reserved.</a>  
      </footer>
    </>  
  )
}

export default App
