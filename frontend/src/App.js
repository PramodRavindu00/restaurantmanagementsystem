import './styles/App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Staff from "./pages/Staff";
import Customer from "./pages/Customer";
import PrivateRoute from "./components/PrivateRoute";
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={<PrivateRoute role="Admin" component={Admin} />}
          />
          <Route
            path="/staff"
            element={<PrivateRoute role="Staff" component={Staff} />}
          />
          <Route
            path="/customer"
            element={<PrivateRoute role="Customer" component={Customer} />}
          />
        </Routes>
      </Router>
      <Footer/>
    </div>
  );
}

export default App;
