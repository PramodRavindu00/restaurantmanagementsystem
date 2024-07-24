import React, { useState } from "react";
import "../styles/form.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    userType : "Customer",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      
      const { confirm, ...valuesToSubmit } = formValues;
      console.log(valuesToSubmit);
      axios
        .post("/user", valuesToSubmit)
        .then((res) => {
          toast.success("user registered successfully");
          setFormValues(initialValues);
        })
        .catch((error) => {
       toast.error("An error occured");
        });
    }
  };

  const validate = (values) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.firstName) {
      errors.firstName = "First name is required!";
    }
    if (!values.lastName) {
      errors.lastName = "Last name is required!";
    }
    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    if (!values.phone) {
      errors.phone = "Phone number is required!";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      errors.password = "Password cannot exceed more than 10 characters";
    }
    if (!values.confirm) {
      errors.confirm = "Confirm password is required";
    } else if (values.confirm !== values.password) {
      errors.confirm = "Passwords do not match";
    }
    return errors;
  };

  return (
    <div className="container">
  
      <h1>Register</h1>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 col-xl-6">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First name"
                name="firstName"
                value={formValues.firstName}
                onChange={handleChange}
              />
              <span className="error-message">{formErrors.firstName}</span>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Last name"
                name="lastName"
                value={formValues.lastName}
                onChange={handleChange}
              />
              <span className="error-message">{formErrors.lastName}</span>
            </Form.Group>

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
            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Label>Contact No</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Contact No"
                name="phone"
                value={formValues.phone}
                onChange={handleChange}
              />
              <span className="error-message">{formErrors.phone}</span>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
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

            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirm"
                  value={formValues.confirm}
                  onChange={handleChange}
                />
                <Button
                  className="btn btn-secondary"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <FontAwesomeIcon
                    icon={confirmPasswordVisible ? faEyeSlash : faEye}
                  />
                </Button>
              </div>
              <span className="error-message">{formErrors.confirm}</span>
            </Form.Group>
            <div className="text-center">
              <Button
                variant="secondary"
                className="btn btn-lg submit"
                type="submit"
              >
                Register
              </Button>
            </div>
          </Form>
        </div>
      </div>
      <ToastContainer
      position="top-center"
      autoClose={1000}
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

export default Register;
