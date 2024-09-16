import React, { useEffect, useState } from "react";
import "../styles/App.css";
import "../styles/form.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Login";
import Home from "./Home";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { Link } from "react-router-dom";

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
    branch: "",
    password: "",
    confirm: "",
    userType: "Customer",
    active: true,
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [branchOptions, setBranchOptions] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormValues({ ...formValues, [name]: numericValue.slice(0, 10) });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  useEffect(() => {
    axios
      .get("/branch/activeBranch")
      .then((response) => {
        const branches = response.data;
        const options = branches.map((branch) => ({
          value: branch.id,
          label: branch.name,
        }));
        setBranchOptions(options);
      })
      .catch((error) => {
        console.error("Error fetching Data");
      });
  }, []);

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setFormValues({ ...formValues, branch: selectedOption.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      const { confirm, ...valuesToSubmit } = formValues;
      // console.log(valuesToSubmit);
      axios
        .post("/user/register", valuesToSubmit)
        .then((res) => {
          toast.success("user registered successfully");
          setFormValues(initialValues);
          setSelectedOption(null);
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            if (error.response.data === "EMAIL") {
              setFormErrors({
                ...errors,
                email: "Email is already registered",
              });
              setFormValues({ ...formValues, email: "" });
            }

            if (error.response.data === "PHONE") {
              setFormErrors({
                ...errors,
                phone: "Phone number is already using with another account",
              });
              setFormValues({ ...formValues, phone: "" });
            }
          } else {
            toast.error("An error occured");
          }
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
      errors.email = "Invalid Email format!";
    }
    if (!values.phone) {
      errors.phone = "Phone number is required!";
    }
    if (!values.branch) {
      errors.branch = "Branch is required!";
    }
    if (!values.password) {
      errors.password = "Password is required!";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      errors.password = "Password cannot exceed more than 10 characters";
    }
    if (!values.confirm) {
      errors.confirm = "Confirm password is required!";
    } else if (values.confirm !== values.password) {
      errors.confirm = "Passwords do not match";
    }
    return errors;
  };

  const routes = [
    { path: "/", name: "Home", component: Home },
    { path: "/login", name: "Login", component: Login },
    { name: "Register" },
  ];

  return (
    <div className="page-content">
      <Navbar routes={routes} />
      <h1>Register</h1>
      <div className="row justify-content-center">
        <div className="col-10 col-sm-8 col-md-6 col-lg-8">
          <Form onSubmit={handleSubmit}>
            <div className="row d-flex justify-content-center">
              <div className="col-lg-4 mb-3">
                <Form.Group controlId="formBasicFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter First name"
                    name="firstName"
                    value={formValues.firstName}
                    onChange={handleChange}
                  />
                  <span className="error-message firstName">{formErrors.firstName}</span>
                </Form.Group>
              </div>
              <div className="col-lg-4 mb-3">
                <Form.Group controlId="formBasicLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Last name"
                    name="lastName"
                    value={formValues.lastName}
                    onChange={handleChange}
                  />
                  <span className="error-message lastName">{formErrors.lastName}</span>
                </Form.Group>
              </div>
            </div>

            <div className="row d-flex justify-content-center">
              <div className="col-lg-4 mb-3">
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                  />
                  <span className="error-message email">{formErrors.email}</span>
                </Form.Group>
              </div>
              <div className="col-lg-4 mb-3">
                <Form.Group controlId="formBasicPhone">
                  <Form.Label>Contact No</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Contact No"
                    name="phone"
                    value={formValues.phone}
                    onChange={handleChange}
                  />
                  <span className="error-message phone">{formErrors.phone}</span>
                </Form.Group>
              </div>
            </div>

            <div className="row d-flex justify-content-center">
              <div className="col-lg-4 mb-3">
                <Form.Group controlId="formBasicPassword">
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
                  <span className="error-message password">{formErrors.password}</span>
                </Form.Group>
              </div>
              <div className="col-lg-4 mb-3">
                <Form.Group controlId="formBasicConfirmPassword">
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
                  <span className="error-message confirm">{formErrors.confirm}</span>
                </Form.Group>
              </div>
            </div>
            <div className="row d-flex justify-content-center">
              <div className="col-lg-4 mb-4">
                <Form.Group controlId="formBasicBranch">
                  <Form.Label>Closest Branch</Form.Label>
                  <Select
                  id="branch"
                    name="branch"
                    options={branchOptions}
                    value={selectedOption}
                    onChange={handleSelectChange}
                    placeholder="Select the branch"
                  />
                  <span className="error-message branch">{formErrors.branch}</span>
                </Form.Group>
              </div>
            </div>
            <div className="row d-flex justify-content-center mb-1">
              <Button
                variant="secondary"
                className="btn btn-lg submit"
                type="submit"
              >
                Register
              </Button>
            </div>
            <div className="row d-flex justify-content-center align-items-center mb-5">
              <div className="col-lg-4 text-center">
                <p className="phrase">
                  Already have an Account?{" "}
                  <Link to="/login" className="formlink">
                    Login
                  </Link>
                </p>
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
  );
}

export default Register;
