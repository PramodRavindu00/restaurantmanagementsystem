import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Branch from './Admin/Branch';
import AdminStaff from './Admin/AdminStaff';
import AdminProducts from './Admin/AdminProducts';
import AdminQueries from './Admin/AdminQueries';
import Reports from './Admin/Reports';

function Admin() {
  const routes = [
    { path: "adminproducts", name: "Products", component: AdminProducts },
    { path: "branch", name: "Branch", component: Branch },
    { path: "adminstaff", name: "Staff", component: AdminStaff },
    { path: "adminqueries", name: "Queries", component: AdminQueries },
    { path: "reports", name: "Reports", component: Reports },
    { path: "profile", name: "Profile", component: AdminProducts },
  ];

  return (
    <div className="page-content">
      <Navbar routes={routes} />
      <Routes>
        <Route path="*" element={<Navigate to="adminproducts" />} />
        {routes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </div>
  );
}

export default Admin;
