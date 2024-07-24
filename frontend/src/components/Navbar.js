import React from "react";
import "../styles/navbar.css";
import { NavLink } from "react-router-dom";

function Navbar({ routes}) {
  return (
    <nav className="nav">
      <div className="info">
        <li className="nav-item">
          <h2>ABC Restaurant</h2>
          </li>
      </div>
      <ul className="navbar">
        {routes.map((route, index) => (
          <li key={index} className="nav-item">
            <NavLink to={route.path} className={({ isActive }) => isActive ? 'active link' : 'link'}>
              {route.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
