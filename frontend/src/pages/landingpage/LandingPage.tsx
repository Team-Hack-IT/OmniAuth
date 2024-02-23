import React from "react";
import Header from "../../components/Header";
import Connect from "../../components/Connect";
import Feature from "../../components/Feature";
import Footer from "../../components/Footer";
import Footer2 from "../../components/Footer2";
import Summary from "../../components/Summary";

const LandingPage = () => {
  return (
    <div>
      <Header />

      <Summary />

      <Feature />

      <Connect />

      <Footer2 />

      <Footer />
    </div>
  );
};

export default LandingPage;
