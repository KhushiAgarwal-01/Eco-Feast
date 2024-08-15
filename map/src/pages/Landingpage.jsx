import React, { useEffect } from 'react';
import './LandingPage.css'; // Import your CSS file
import { Link } from 'react-router-dom'


const LandingPage = () => {
  useEffect(() => {
    const handleScroll = () => {
      const navBar = document.querySelector("#navbar");
      const truck = document.querySelector("#truck");
      const info = document.querySelector("#info");
      const overlay = document.querySelector("#overlay");
      const logoText = document.querySelector("#logo > span");

      let scrollValue = window.scrollY;
      let documentHeight = document.body.scrollHeight;
      let currentScroll = scrollValue + window.innerHeight;

      if (currentScroll + 150 > documentHeight) {
        navBar.classList.add("sticky-navbar");
        logoText.classList.add("sticky-logo");
      } else {
        navBar.classList.remove("sticky-navbar");
        logoText.classList.remove("sticky-logo");
      }

      truck.style.left = scrollValue * 1.5 + "px";
      info.style.left = scrollValue * -1.5 + "px";
      overlay.style.left = scrollValue * -1.5 + "px";
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div id="wrapper">
      {/* <img id="overlay" src="./images/overlay.svg" alt="Overlay" /> */}
      <nav id="navbar">
        <div id="logo">
          <img src="./images/logo.svg" alt="Logo" />
          <span>MealMover</span>
        </div>

        <div id="links">
          {/* <a href="#">Menu</a>
          <a href="#">Order</a>
          <a href="#">Track</a>
          <a href="#">Promotions</a>
          <div className="btn">Account</div> */}

        <Link to='/'>
        <li>Home</li>
        </Link>
        
        <Link to='/searchpage'>
        <li>Search</li>
        </Link>

        <Link to='/sign-up'>
        <div className="btn">Account</div>
        </Link>
      
        </div>
      </nav>

      <section id="main-section">
        <div id="info">
          <h2>Delivering deliciousness</h2>
          <span>
            Get your favorite dishes delivered straight to your doorstep! Our efficient delivery system and user-friendly app make it easy to satisfy your cravings. Download now and enjoy hassle-free food delivery.
          </span>
          <div className="btn">Order Now</div>
        </div>

        <img src="./images/truck.png" id="truck" alt="Truck" />
      </section>

      <section id="secondary-section">
        <div id="steps">
          <h1>How It Works?</h1>

          <div>
            <img src="./images/order.svg" alt="Order" />
            <span>Choose your meals from our menu and make your order</span>
          </div>

          <div>
            <span>Your meals will be delivered to your doorstep</span>
            <img src="./images/delivery.svg" alt="Delivery" />
          </div>

          <div>
            <img src="./images/enjoy.svg" alt="Enjoy" />
            <span>Enjoy fresh and tasty food with your loved ones!</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
