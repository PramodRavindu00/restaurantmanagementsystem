import "./styles/App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Staff from "./pages/Staff";
import Customer from "./pages/Customer";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";
import { LoggedUser } from "./components/LoggedUser";

function App() {
  const userType = localStorage.getItem("userType");

  const redirect = () => {  //redirection if user edited URL
    if (!userType) return "/login";   //if a valid login not exist

    switch (userType) {   //based on usertypes
      case "Admin":
        return "/admin/adminProducts";
      case "Staff":
        return "/staff/ordermanage";
      case "Customer":
        return "/customer/customerproducts";
        default:
          return "/login";
    }
  };

  return (
    // logged user context
    <LoggedUser>    
    <div className="app-container">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin/*"
            element={<PrivateRoute role="Admin" component={Admin} />}   //privateRoute used to prevent user editing the URL
          />
          <Route
            path="/staff/*"
            element={<PrivateRoute role="Staff" component={Staff} />}
          />
          <Route
            path="/customer/*"
            element={<PrivateRoute role="Customer" component={Customer} />}
          />
          <Route path="*" element={<Navigate to={redirect()} />} />
        </Routes>
      </Router>
      <Footer />
    </div>
    </LoggedUser>
  );
}

export default App;
