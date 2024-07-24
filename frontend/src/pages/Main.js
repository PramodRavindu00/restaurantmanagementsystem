import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Login'
import Register from "./Register";
import Home from "./Home";
import Navbar from "../components/Navbar";

function Main() {
  const routes = [
    { path: "/", name: "Home", Component: Home },
    { path: "/login", name: "Login", Component: Login },
    { path: "/register", name: "Register", Component: Register },
  ];
  return (
    <div>
      <Router>
        <Navbar routes={routes} />
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.Component />}
            />
          ))}
        </Routes>
      </Router>
    </div>
  );
}

export default Main;
