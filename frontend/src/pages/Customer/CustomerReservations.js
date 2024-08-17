import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, ToastContainer } from "react-bootstrap";
import Model from "../../components/Model";
import { Bounce } from "react-toastify";
import { useUser } from "../../components/LoggedUser";
import Select from "react-select";
import axios from "axios";

function CustomerReservations() {
  let loggeduser = useUser();
  if (!loggeduser) {
    loggeduser = JSON.parse(localStorage.getItem("loggedUser"));
  }

  const initialValues = {
    customerID: loggeduser.id,
    phone: loggeduser.phone,
    branch:loggeduser.branch,
    date: "",
    time: "",
    seats: "",
    info: "",
    status:"pending",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [modalTitle, setModalTitle] = useState("");
  const [modalAction, setModalAction] = useState("");
  const [show, setShow] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [branchOptions, setBranchOptions] = useState([]);
  const [count, setCharCount] = useState(150);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "seats" || name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (name === "phone") {
        setFormValues({ ...formValues, [name]: numericValue.slice(0, 10) });
      } else {
        setFormValues({ ...formValues, [name]: numericValue });
      }
    } else if (name === "info" && value.length <= 150) {
      setFormValues({ ...formValues, [name]: value });
      setCharCount(150 - value.length);
    } else if (name !== "info") {
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

        const selectedBranch = options.find(
          (option) => option.value === loggeduser.branch
        );
        setSelectedOption(selectedBranch || null);
      })
      .catch((error) => {
        console.error("Error fetching branches:", error);
      });
  }, [loggeduser.branch]);

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setFormValues({ ...formValues, branch: selectedOption.value });
  };

  const handleEdit = (branch) => {
    setFormValues(branch);
    setModalTitle("Edit Reservation");
    setModalAction("edit");
    setShow(true);
  };

  const handleAdd = () => {
    setFormValues(initialValues);
    setModalTitle("Submit Reservation");
    setModalAction("add");
    setShow(true);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    console.log(formValues);
    
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      if (modalAction === "add") {
        axios
          .post("/customer/addReservation", formValues)
          .then((res) => {
           // toast.success("Branch registered successfully");
           console.log(res.status);
           
            setFormValues(initialValues);
            //fetchBranches();
            setShow(false);
          })
          .catch((error) => {
              //toast.error("An error occurred");
          });
      } 
      // else if (modalAction === "edit") {
      //   axios
      //     .put(`/branch/update/${formValues.id}`, formValues)
      //     .then((res) => {
      //       toast.success("Branch updated successfully");
      //       setFormValues(initialValues);
      //       fetchBranches();
      //       setShow(false);
      //     })
      //     .catch((error) => {
      //       if (error.response && error.response.status === 400) {
      //         setFormErrors({
      //           ...errors,
      //           name: "Branch name already exists",
      //         });
      //         setFormValues({ ...formValues, name: "" });
      //       } else {
      //         toast.error("An error occurred");
      //       }
      //     });
      // }
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.branch) {
      errors.branch = "Branch is required!";
    }
    if (!values.date) {
      errors.date = "Date is required!";
    }
    if (!values.time) {
      errors.time = "Time is required!";
    }
    if (!values.phone) {
      errors.phone = "Contact no is required!";
    }
    if (!values.seats) {
      errors.seats = "No of persons is required!";
    }
    return errors;
  };
  const ModalClose = () => {
    setShow(false);
    setFormValues(initialValues);
    const selectedBranch = branchOptions.find(
      (option) => option.value === loggeduser.branch
    );
    setSelectedOption(selectedBranch || null);
    setFormErrors({});
    setCharCount(150);
  };

  return (
    <div style={{ margin: "0 auto", width: "95%" }}>
      <div className="row" style={{ margin: "20px 0" }}>
        <div className="col-12 d-flex flex-column flex-md-row justify-content-between">
          <div className="col-12 col-md-6 col-lg-6">
            <Button variant="primary" onClick={handleAdd}>
              New Reservation
            </Button>
          </div>
          <div className="col-12 col-md-6 col-lg-6">col2</div>
        </div>
      </div>

      {/* Modal */}
      <Model
        title={
          <Form.Group className="text-center">
            <h2>{modalTitle}</h2>
          </Form.Group>
        }
        body={
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicBranch">
              <Form.Label>Branch</Form.Label>
              <Select
                name="branch"
                options={branchOptions}
                value={selectedOption}
                onChange={handleSelectChange}
                placeholder="Select the branch"
              />
              <span className="error-message">{formErrors.branch}</span>
            </Form.Group>
            <Form.Group >
              <Row className="d-flex flex-lg-row flex-column">
                <Col className="col-lg-6 d-flex flex-column mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control controlId="formBasicDate"
                    type="date"
                    placeholder="Select the date"
                    name="date"
                    value={formValues.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <span className="error-message">{formErrors.date}</span>
                </Col>
                <Col className="col-lg-6 d-flex flex-column mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control controlId="formBasicTime"
                    type="time"
                    placeholder="Select a time"
                    name="time"
                    value={formValues.time}
                    onChange={handleChange}
                  />
                  <span className="error-message">{formErrors.time}</span>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3">
              <Row className="d-flex flex-lg-row flex-column">
                <Col className="col-lg-6 d-flex flex-column mb-3">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control controlId="formBasicContact"
                    type="text"
                    placeholder="Enter contact no"
                    name="phone"
                    value={formValues.phone}
                    onChange={handleChange}
                  />
                  <span className="error-message">{formErrors.phone}</span>
                </Col>
                <Col className="col-lg-6 d-flex flex-column mb-3">
                  <Form.Label>No of Persons</Form.Label>
                  <Form.Control controlId="formBasicSeats"
                    type="text"
                    placeholder="Enter a number"
                    name="seats"
                    value={formValues.seats}
                    onChange={handleChange}
                  />
                  <span className="error-message">{formErrors.seats}</span>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicInfo">
              <Form.Label>Additional Information</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter Additional Information"
                name="info"
                value={formValues.info}
                onChange={handleChange}
                rows={3}
              />
              <div className="text-muted">{count} characters remaining</div>
            </Form.Group>
            <div className="text-center mt-5">
              <Button
                variant="secondary"
                onClick={ModalClose}
                style={{ marginRight: "10px" }}
              >
                Close
              </Button>
              <Button variant="primary" type="submit">
                {modalAction === "add" ? "Submit Reservation" : "Save Changes"}
              </Button>
            </div>
          </Form>
        }
        footer={null}
        show={show}
        close={ModalClose}
      />

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

export default CustomerReservations;
