import '../styles/App.css';
import React from 'react';
import Home from "./Home";
import Login from './Login';
import Register from "./Register";
import Navbar from "../components/Navbar";


function Customer() {
  const routes = [
    { path: "/", name: "Bill", component: Home },
    { path: "/login", name: "Orders", component: Login },
    { path: "/register", name: "Profile", component: Register },
  ];
  return (
    <div className="page-content">
        <Navbar routes={routes} />
<h1>This is customer</h1>

    </div>
  )
}

export default Customer