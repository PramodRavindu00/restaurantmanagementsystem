import React from "react";
import '../styles/App.css';
import '../styles/home.css';
import pizza from "../assets/landing.jpg";
import restaurant from '../assets/restaurant.jpg';
import waiter from '../assets/waiter.jpeg';
import dishes from '../assets/dishes.webp';
import noodle from '../assets/main.jpg';
import burger from '../assets/bg.jpg';
import Login from "./Login";
import Register from "./Register";
import Navbar from "../components/Navbar";

function Home() {
  const routes = [
    { path: "/", name: "Home",},
    { path: "/login", name: "Login", component: Login },
    { path: "/register", name: "Register", component: Register },
  ];
  return (
    <div className="page-content">
       <Navbar routes={routes} />
       <div className="home-content">
      <h1>Welcome to ABC Restaurant</h1>
      <div className="one">
        <div className="photo">
          <img src={pizza} alt="pizza"/>
        </div>
        <div className="content1">
          <h4>A Culinary Journey Through Sri Lanka</h4>
          <p>
            At ABC Restaurant, we pride ourselves on offering an exceptional
            dining experience that blends the rich culinary traditions of Sri
            Lanka with modern innovation. Established with the goal of bringing
            diverse flavors to your table, we have become a beloved destination
            for food enthusiasts across the country.
          </p>
        </div>
      </div>
      <div className="two">
        <div className="photo">
          <img src={waiter} alt="waiter"/>
        </div>
        <div className="content2">
          <h4>Our Story</h4>
          <p>
            Founded with a passion for food and a commitment to quality, ABC
            Restaurant has grown from a single location to a popular chain with
            establishments in many cities across Sri Lanka. Our journey began
            with a simple mission: to create a place where people could come
            together to enjoy delicious food, warm hospitality, and a welcoming
            atmosphere.
          </p>
        </div>
      </div>
      <div className="three">
        <div className="photo">
          <img src={dishes} alt="dishes"/>
        </div>
        <div className="content3">
          <h4>Our Cuisine</h4>
          <p>
            Our menu features a wide array of dishes, from classic Sri Lankan
            favorites to contemporary fusion creations. Our chefs use only the
            freshest ingredients, sourced locally whenever possible, to ensure
            that every bite is bursting with flavor. Whether you're craving a
            hearty traditional meal, a light and healthy option, or something
            entirely new, you'll find it at ABC Restaurant.
          </p>
        </div>
      </div>
      <div className="four">
        <div className="photo">
          <img src={restaurant} alt="restaurant"/>
        </div>
        <div className="content4">
          <h4>Our Ambiance</h4>
          <p>
            Each ABC Restaurant location is designed to provide a comfortable
            and inviting environment for our guests. From elegant dining rooms
            to cozy corners, our spaces are perfect for family gatherings,
            romantic dinners, business meetings, or casual outings with friends.
            Our friendly and attentive staff are always on hand to ensure that
            your visit is memorable.
          </p>
        </div>
      </div>
      <div className="five">
        <div className="photo">
          <img src={noodle} alt="noodle"/>
        </div>
        <div className="content5">
          <h4>Our Commitment</h4>
          <p>
            At ABC Restaurant, we are dedicated to sustainability and community.
            We strive to minimize our environmental impact through eco-friendly
            practices and support local farmers and suppliers. Additionally, we
            believe in giving back to the communities we serve and are involved
            in various charitable initiatives.
          </p>
        </div>
      </div>
      <div className="six">
        <div className="photo">
          <img src={burger} alt="burger"/>
        </div>
        <div className="content6">
          <h4>Join Us</h4>
          <p>
            We invite you to explore the diverse and delectable offerings at ABC
            Restaurant. Whether you’re visiting us for the first time or are a
            returning guest, we promise an experience that delights all your
            senses. Come and discover why ABC Restaurant is a cherished part of
            Sri Lanka’s culinary landscape.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Home;
