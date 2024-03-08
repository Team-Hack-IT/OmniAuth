import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Footer2 from "./Footer2.jsx";

function About() {
  return (
    <div>
      <Header />
      <div className="max-w-[950px] mx-auto">
        <div className="text-center pt-10 ">
          <a className="font-bold text-2xl text-primary">About Us</a>
          <p className="text-primary">
            Welcome to OmniAuth, your trusted partner in securing digital
            identities and transactions. Our comprehensive suite of security
            solutions empowers businesses and individuals to protect sensitive
            information, prevent fraud, and enhance trust in online
            interactions.
          </p>
        </div>

        <h3 className="text-center font-bold py-5 text-2xl text-primary">
          Our Services
        </h3>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-10 mx-5">
          <div className="">
            <h2 className="font-semibold text-primary text-xl w-[200px] py-2">
              Secure User Authentication
            </h2>
            <p>
              At OmniAuth, we understand the importance of robust authentication
              mechanisms in safeguarding user accounts and sensitive data. Our
              authentication solutions leverage industry-leading techniques to
              verify user identities securely, including multi-factor
              authentication (MFA), biometric authentication, and strong
              password policies.
            </p>
          </div>
          <div className="">
            <h2 className="font-semibold text-primary  text-xl w-[200px] py-2">
              Phone Number Verification
            </h2>
            <p>
              Verify the identities of your users with confidence using our
              phone number verification service. By confirming the ownership of
              phone numbers through SMS or voice call verification, businesses
              can prevent unauthorized access, mitigate fraud, and comply with
              regulatory requirements.
            </p>
          </div>

          <div className="">
            <h2 className="font-semibold text-primary  text-xl w-[200px] py-2">
              ID Verification
            </h2>
            <p>
              Ensure the authenticity and validity of user identities with our
              ID verification service. Our advanced verification technology
              analyzes government-issued IDs, passports, and driver&#39;s
              licenses to confirm identity documents&#39; authenticity, helping
              businesses comply with Know Your Customer (KYC) regulations and
              prevent identity theft.
            </p>
          </div>

          <div className="">
            <h2 className="font-semibold text-primary  text-xl w-[200px] py-2">
              Unique API Key Generation
            </h2>
            <p>
              Secure your APIs and control access to your services with our
              unique API key generation service. Our randomly generated keys
              provide a secure form of authentication, enabling businesses to
              authenticate and authorize users, applications, and services
              accessing their APIs securely.
            </p>
          </div>
        </div>

        <h3 className="text-center py-10 font-bold text-2xl text-primary">
          Why You Should Choose Us
        </h3>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-10 mx-5 ">
          
            <div className="">
              <h2 className="font-semibold text-primary  text-xl w-[200px] py-2">Security First</h2>
              <p>
                We prioritize security in everything we do, employing advanced
                encryption techniques and adhering to industry best practices to
                protect user data and privacy.
              </p>
            </div>
            <div className="">
              <h2 className="font-semibold text-primary  text-xl w-[200px] py-2">Ease of Integration</h2>
              <p>
                Seamlessly integrate our security services into your existing
                systems and workflows with our user-friendly APIs and
                developer-friendly documentation.
              </p>
       
          </div>

       
            <div className="">
              <h2 className="font-semibold text-primary  text-xl w-[200px] py-2">Reliability and Scalability</h2>
              <p>
                Our scalable infrastructure ensures high availability and
                performance, allowing businesses to scale their security
                solutions as their needs evolve.
              </p>
            </div>

            <div className="">
              <h2 className="font-semibold text-primary  text-xl w-[200px] py-2">Compliance and Trust</h2>
              <p>
                {" "}
                OmniAuth is committed to compliance with regulatory requirements
                and industry standards, providing businesses and users with
                peace of mind and confidence in our services.
              </p>
         
          </div>
        </div>
        <div className="">
          <h3 className="text-center py-10 font-bold text-2xl text-primary">Get Started With OmniAuth</h3>
          <p className="text-center">
            Protect your digital assets and build trust with your users by
            leveraging SecureGuard&#39;s comprehensive security solutions.
            Contact us today to learn more about how we can help secure your
            business and enhance your online presence.
          </p>
        </div>

        <Footer2 />

        <Footer />
      </div>
    </div>
  );
}

export default About;
