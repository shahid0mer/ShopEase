import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Categories from "../components/Categories";
import Carousel from "../components/Carousel";
import TopPicks from "../components/TopPicks";
import Login from "../components/Login";
import Newsletter from "../components/Newsletter";
import Features from "../components/Features";
import Footer from "../components/Footer";

const Home = () => {
  
  return (
    <div className="relative">
      {/* Main Content with blur when modal is active */}
     
        
        <main className="space-y-[var(--space-4xl)]">
          <Categories />
          <Carousel />
          <TopPicks />
          <Newsletter />
          <Features />
          <Footer />
        </main>
      </div>

   
  );
};

export default Home;
