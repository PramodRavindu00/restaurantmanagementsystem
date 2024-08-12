import React, { useState } from "react";
import "../styles/form.css";
import '../styles/App.css';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Home from "./Home";
import Register from "./Register";

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const initialValues = {
    email: "",
    password: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      const { ...valuesToSubmit } = formValues;
      axios
        .post("/user/login", valuesToSubmit)
        .then((res) => {
          const { token, userType } = res.data;
          localStorage.setItem("authToken", token);
          localStorage.setItem("userType", userType);

          toast.success("Login success");
          setFormValues(initialValues);
          setTimeout(() => {
            if (userType === "Admin") {
              navigate("/admin/adminProducts");
            } else if (userType === "Staff") {
              navigate("/staff/ordermanage");
            } else if (userType === "Customer") {
              navigate("/customer/customerProducts");
            }
          }, 1500);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 404) {
              toast.error("User Not Found. Please Check Your Email");
              setFormValues(initialValues);
            } else if (error.response.status === 400) {
              toast.error("Incorrect Password");
              setFormValues({ ...formValues, password: "" });
            } else {
              toast.error("An error occured. Please try again later");
              setFormValues(initialValues);
            }
          } else {
            toast.error("An error occured. Please try again later");
            setFormValues(initialValues);
          }
        });
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email is required!";
    }

    if (!values.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const routes = [
    { path: "/", name: "Home", component: Home },
    { name: "Login",},
    { path: "/register", name: "Register", component: Register },
  ];
  return (
    <div className="page-content">
       <Navbar routes={routes} />
      <Form.Group className="mb-4">
        <h1>Login</h1>
      </Form.Group>
      <div className="row justify-content-center">
      <div className="col-10 col-sm-8 col-md-6 col-lg-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
              />
              <span className="error-message">{formErrors.email}</span>
            </Form.Group>
            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                />
                <Button
                  className="btn btn-secondary"
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                  />
                </Button>
              </div>
              <span className="error-message">{formErrors.password}</span>
            </Form.Group>
            <div className="text-center">
              <Button
                variant="secondary"
                className="btn btn-lg submit"
                type="submit"
              >
                Login
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={750}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}

export default Login;