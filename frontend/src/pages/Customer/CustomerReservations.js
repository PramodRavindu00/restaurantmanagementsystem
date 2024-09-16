import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import Model from "../../components/Model";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Table from "./../../components/Table";
import Select from "react-select";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import Confirm from "./../../components/Confirm";
import { BasicSpinner } from "../../components/Utils";



function CustomerReservations() {
  const loggeduser = JSON.parse(localStorage.getItem('user'));
  
  const initialValues = {
    customerID: loggeduser.id,
    phone: loggeduser.phone,
    branch: "",
    date: "",
    time: "",
    seats: "",
    info: "",
    status: "pending",
  };

  const [submitmessage, setSubmitMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [modalTitle, setModalTitle] = useState("");
  const [modalAction, setModalAction] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [branchOptions, setBranchOptions] = useState([]);
  const [count, setCharCount] = useState(150);
  const [show, setShow] = useState(false);
  const [reservations, setReservations] = useState([loggeduser.id]);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "seats" || name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
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

        setFormValues((prevValues) => ({
          ...prevValues,
          branch: loggeduser.branch,
        }));
      })
      .catch((error) => {
        console.error("Error fetching branches:", error);
      });
  }, [loggeduser.branch]);

  useEffect(() => {
    fetchReservations(); //display customer reservations
  }, [loggeduser.id]);

  const columns = [
    {
      name: "Reservation No",
      selector: (row) => row.reservationNo, //selector function extract the relavnt data
      sortable: true,
    },
    {
      name: "Branch",
      selector: (row) => row.branch,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: "Time",
      selector: (row) => row.time,
      sortable: true,
    },
    {
      name: "No of Seats",
      selector: (row) => row.seats,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Edit",
      cell: (row) =>
        row.status === "pending" && row.status !== "Declined" &&(
          <Button
            onClick={() => handleEdit(row)} //getting the single  object as the paramter
            variant="warning"
            title="Edit Reservation Details"
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
        ),
    },
    {
      name: "Cancel",
      cell: (row) =>
        row.status !== "Declined" &&
        row.status !== "Cancelled" &&
        row.status !== "Completed" && (
          <Button
            onClick={() => handleCancel(row)}
            variant="danger"
            title="Cancel Reservation"
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        ),
    },
  ];

  const fetchReservations = () => {
    axios
      .get(`/customer/getCustomerReservations/${loggeduser.id}`)
      .then((response) => {
        setReservationsLoading(false);
        const result = response.data.map((item) => ({
          id: item.id,
          reservationNo: item.reservationNo,
          date: item.date,
          branch: item.branch,
          branchID: item.branchID,
          time: item.time,
          seats: item.seats,
          status: item.status,
          phone: item.phone,
          info: item.info,
        }));
        setReservations(result);
      })
      .catch((error) => console.error(error));
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setFormValues({ ...formValues, branch: selectedOption.value });
  };

  const handleEdit = (reservation) => {
    const selectedBranch = branchOptions.find(
      (option) => option.value === reservation.branchID
    );
    setSelectedOption(selectedBranch || null);
    const editingValues = {
      id: reservation.id,
      reservationNo: reservation.reservationNo,
      branch: selectedBranch.value,
      date: reservation.date,
      time: reservation.time,
      seats: reservation.seats,
      customerID: loggeduser.id,
      info: reservation.info,
      status: reservation.status,
      phone: reservation.phone,
    };
    setFormValues(editingValues);
    setModalTitle("Edit Reservation");
    setModalAction("edit");
    setShow(true);
  };

  const handleAdd = () => {
    setFormValues(initialValues);
    setFormValues({ ...formValues, branch:loggeduser.branch });
    setModalTitle("Submit Reservation");
    setModalAction("add");
    setShow(true);
  };

  const handleCancel = (reservation) => {
    Confirm({
      title: "Confirm Cancellation",
      message: "Are you sure you want to cancel the reservation?",
      onConfirm: () => {
        axios
          .put(`/customer/cancelReservation/${reservation.id}`)
          .then((res) => {
            toast.success('Reservation Cancelled');
            setTimeout(() => {
              fetchReservations();
            }, 1000);
          })
          .catch((error) => {
            toast.error('An error occured');
          });
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    console.log(formValues);

    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      if (modalAction === "add") {
        axios
          .post("/customer/addReservation", formValues)
          .then((res) => {
            const reservation = res.data;
            setSubmitMessage(`We recieved your reservation.
             Your reservation no is ${reservation.reservationNo}.
              We will update you via emails about next steps of this reservation`);
            setMessageClass("text-success");
            setFormValues(initialValues);
            setLoading(false);
            setTimeout(() => {
              setShow(false);
              setSubmitMessage("");
              setMessageClass("");
            }, 2000);
            fetchReservations();
          })
          .catch((error) => {
            setSubmitMessage("An error occured");
            setMessageClass("text-danger");
            setFormValues(initialValues);
            setLoading(false);
            setTimeout(() => {
              setShow(false);
              setSubmitMessage("");
              setMessageClass("");
            }, 1500);
          });
      }
      else if (modalAction === "edit") {
        console.log(`edit`);
        axios
          .put(`/customer/updateReservation/${formValues.id}`, formValues)
          .then((res) => {
            setSubmitMessage("Reservation details has been updated");
            setMessageClass("text-success");
            setFormValues(initialValues);
            setLoading(false);
            setTimeout(() => {
              setShow(false);
              setSubmitMessage("");
              setMessageClass("");
            }, 3000);
            fetchReservations();
          })
          .catch((error) => {
            setSubmitMessage("An error occured");
            setMessageClass("text-danger");
            setFormValues(initialValues);
            setLoading(false);
            setTimeout(() => {
              setShow(false);
              setSubmitMessage("");
              setMessageClass("");
            }, 1500);
          });
      }
    } else {
      console.log("has errors");
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
    <Container fluid style={{ margin: "20px 0" }}>
      <Row className="d-flex flex-column flex-lg-row">
        <Col xs={12} lg={12} className="d-flex justify-content-center">
        {reservationsLoading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
          <Table
            title={null}
            columns={columns}
            data={reservations}
            rowsPerPage={10}
            addButton={
              <Button variant="primary" onClick={handleAdd}>
                New Reservation
              </Button>
            }
          />
        )}
        </Col>
      </Row>

      {/* Modal */}
      <Model
        title={
          <Form.Group className="text-center">
            <h2>{modalTitle}</h2>
          </Form.Group>
        }
        body={
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2" controlId="formBasicBranch">
              <Form.Label>Branch</Form.Label>
              <Select
                name="branch"
                options={branchOptions}
                value={selectedOption}
                onChange={handleSelectChange}
                placeholder="Select the branch"
                isDisabled = {modalAction === "edit"}
              />
              <span className="error-message">{formErrors.branch}</span>
            </Form.Group>
            <Form.Group>
              <Row className="d-flex flex-lg-row flex-column">
                <Col className="col-lg-6 d-flex flex-column mb-2">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Select the date"
                    name="date"
                    value={formValues.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <span className="error-message">{formErrors.date}</span>
                </Col>
                <Col className="col-lg-6 d-flex flex-column mb-2">
                  <Form.Label>Time</Form.Label>
                  <input
                    className="form-control"
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
                <Col className="col-lg-6 d-flex flex-column mb-2">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter contact no"
                    name="phone"
                    value={formValues.phone}
                    onChange={handleChange}
                  />
                  <span className="error-message">{formErrors.phone}</span>
                </Col>
                <Col className="col-lg-6 d-flex flex-column mb-2">
                  <Form.Label>No of Persons</Form.Label>
                  <Form.Control
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
            <Form.Group className="mb-2" controlId="formBasicInfo">
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
            <Form.Group className="mb-2 text-center">
              <span className={messageClass}>{submitmessage}</span>
              {loading && (
                <BasicSpinner/>
              )}
            </Form.Group>
            <div className="text-center mt-3">
              <Button
                variant="secondary"
                onClick={ModalClose}
                style={{ marginRight: "10px" }}
              >
                Close
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
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
    </Container>
  );
}

export default CustomerReservations;
