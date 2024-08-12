import '../styles/App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import OrderManage from './Staff/OrderManage';

function Staff(){
    const routes = [
      { path: "ordermanage", name: "Orders", component: OrderManage },
      { path: "profile", name: "Profile", component: OrderManage },
      
    ];
  
    return (
      <div className="page-content">
        <Navbar routes={routes} />

        {/* child elements routing */}
        <Routes>    
          {/* if user entered invalid URL redirect to the default page */}
          <Route path="*" element={<Navigate to="ordermanage" />} />
          {routes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </div>
    );
  }

export default Staff