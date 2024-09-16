import '../styles/App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import OrderManage from './Staff/OrderManage';
import BranchReservations from './Staff/BranchReservations';
import Billing from './Staff/Billing';

function Staff(){

    const routes = [
      { path: "billing", name: "Billing", component: Billing },
      { path: "ordermanage", name: "Orders", component: OrderManage },
      { path: "branchReservations", name: "Reservations", component: BranchReservations },
      // { path: "profile", name: "Profile", component: OrderManage },
      
    ];
  
    return (
      <div className="page-content">
        <Navbar routes={routes} />

        {/* child elements routing */}
        <Routes>    
          {/* if user entered invalid URL redirect to the default page */}
          <Route path="*" element={<Navigate to="branchReservations" />} />
          {routes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </div>
    );
  }

export default Staff