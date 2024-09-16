import '../styles/App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import CustomerProducts from './Customer/CustomerProducts';
import MyOrders from './Customer/MyOrders';
import CustomerQueries from './Customer/CustomerQueries';
import CustomerReservations from './Customer/CustomerReservations';


function Customer() {

    const routes = [
      { path: "customerProducts", name: "Menu", component: CustomerProducts },
      { path: "myorders", name: "Cart & Orders", component: MyOrders },
      { path: "customerReservation", name: "Reservations", component: CustomerReservations },
      { path: "myqueries", name: "Ask ABC", component: CustomerQueries },
      // { path: "profile", name: "Profile", component: MyOrders },
    ];
  
    return (
      <div className="page-content">
        <Navbar routes={routes} />
        <Routes>
          <Route path="*" element={<Navigate to="customerProducts" />} />
          {routes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </div>
    );
  }

export default Customer