import React, { useState } from "react";
import "../styles/form.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  return (
    <div className="container">
      <Form.Group className="mb-5">
        <h1>Login</h1>
      </Form.Group>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 col-xl-6">
          <Form>
            <Form.Group className="mb-4" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-5" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Password"
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
    </div>
  );
}

export default Login;
