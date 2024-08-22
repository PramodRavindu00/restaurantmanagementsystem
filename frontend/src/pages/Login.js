import React, { useState } from "react";
import "../styles/form.css";
import "../styles/App.css";
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
          const data = res.data;
          const userData = {
            branch: data.branch,
            email: data.email,
            firstName: data.firstName,
            id: data.id,
            lastName: data.lastName,
            phone: data.phone,
            token: data.token,
            userType: data.userType,
          };

          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("token", data.token);
          localStorage.setItem("userType", data.userType);
          const userType = data.userType;

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
    { name: "Login" },
    { path: "/register", name: "Register", component: Register },
  ];
  return (
    <div className="page-content">
      <Navbar routes={routes} />
      <div className="row justify-content-center">
        <div className="col-10 col-sm-8 col-md-6 col-lg-8">
          <Form.Group className="mb-2">
            <h1>Login</h1>
          </Form.Group>
          <div className="row justify-content-center">
            <div className="col-12 col-sm-8 col-md-6 col-lg-10">
              <Form onSubmit={handleSubmit}>
                <div className="row d-flex justify-content-center">
                  <div className="col-lg-5">
                    <Form.Group className="mb-3" controlId="formBasicEmail">
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
                  </div>
                </div>
                <div className="row d-flex justify-content-center">
                  <div className="col-lg-5">
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
                      <span className="error-message">
                        {formErrors.password}
                      </span>
                    </Form.Group>
                  </div>
                </div>
                <div className="row d-flex justify-content-center">
                  <div className="text-center">
                    <Button
                      className="btn-lg submit"
                      variant="secondary"
                      type="submit"
                    >
                      Login
                    </Button>
                  </div>
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
      </div>
    </div>
  );
}

export default Login;
