import React from "react";
import "../styles/navbar.css";
import logo from "../assets/ABC.png"
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import Confirm from './Confirm';

function Navbar({ routes}) {

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const logout = ()=>{
    localStorage.clear();
    
    setTimeout(()=>{
      navigate("/login");
    },1000)
  }

  const ShowConfirm = ()=>{
    Confirm({
      title:'Confirm Logout',
      message:'Are you sure you want to log out?',
      onConfirm:logout,
    });
  };

  return (
    <nav className="nav">
      <div className="info">
        <li className="nav-item">
       <img src={logo} height={100}/>
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

        {/* conditionally rendering the logout button */}
        {token && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/' &&(
 <li className="nav-item">
 <button onClick= {ShowConfirm} className="logout" aria-label="Logout" title="Logout"><FontAwesomeIcon icon={faSignOut}/>
   </button>
</li>
        )}
       
      </ul>
    </nav>
  );
}

export default Navbar;
