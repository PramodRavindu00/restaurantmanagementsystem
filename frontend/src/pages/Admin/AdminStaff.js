import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./../../styles/form.css";
import Table from "./../../components/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faRedo,
  faBan,
  faEyeSlash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Confirm from "./../../components/Confirm";
import Model from "../../components/Model";
import Select from "react-select";

function AdminStaff() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  //initial values of the form fields
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    branch: "",
    password: "",
    confirm: "",
    userType: "Staff",
    active: true,
  };

  const [allStaff, setStaff] = useState([]);
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [branchOptions, setBranchOptions] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [modalAction, setModalAction] = useState("");
  const [show, setShow] = useState(false);

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
        setSelectedOption(null);
      })
      .catch((error) => {
        console.error("Error fetching Data");
      });
  }, []);

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setFormValues({ ...formValues, branch: selectedOption.value });
  };

  useEffect(() => {
    fetchAllStaff(); //display all branches
  }, []);

  const fetchAllStaff = () => {
    axios
      .get("/user/allStaff")
      .then((response) => {
        const result = response.data.map((item) => ({
          id: item.id,
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
          phone: item.phone,
          userType: item.userType,
          password: item.password,
          branchID:item.branchID,
          branch: item.branch,
          active: item.active,
        }));
        setStaff(result);
      })
      .catch((error) => console.error(error));
  };

  //columns and data objects for the table
  const columns = [
    {
      name: "First Name",
      selector: (row) => row.firstName, //selector function extract the relavnt data
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.lastName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Contact No",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "User Type",
      selector: (row) => row.userType,
      sortable: true,
    },
    {
      name: "Branch",
      selector: (row) => row.branch,
      sortable: true,
    },
    {
      name: "Edit",
      cell: (row) => (
        <Button
          onClick={() => handleEdit(row)} //getting the single branch object as the paramter
          variant="warning"
          title="Edit Staff Details"
        >
          <FontAwesomeIcon icon={faEdit} />
        </Button>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        
        <>{
          row.userType === 'Staff' && (
            <>
             {row.active ? (
            <Button
              onClick={() => handleAction(row.id, "deactivate")}
              variant="danger"
              title="Deactivate Staff User Account"
            >
              <FontAwesomeIcon icon={faBan} />
            </Button>
          ) : (
            <Button
              onClick={() => handleAction(row.id, "activate")}
              variant="success"
              title="Reactivate Staff User Account"
            >
              <FontAwesomeIcon icon={faRedo} />
            </Button>
          )}
            </>
          )
        }
        </>
      ),
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  //submit the form insert or edit
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      if (modalAction === "add") {
        axios
          .post("/branch/add", formValues)
          .then((res) => {
            toast.success("Branch registered successfully");
            setFormValues(initialValues);
            fetchAllStaff();
            setShow(false);
          })
          .catch((error) => {
            if (error.response && error.response.status === 400) {
              setFormErrors({
                ...errors,
                name: "Branch name already exists",
              });
              setFormValues({ ...formValues, name: "" });
            } else {
              toast.error("An error occurred");
            }
          });
      } else if (modalAction === "edit") {
        axios
          .put(`/branch/update/${formValues.id}`, formValues)
          .then((res) => {
            toast.success("Branch updated successfully");
            setFormValues(initialValues);
            fetchAllStaff();
            setShow(false);
          })
          .catch((error) => {
            toast.error("An error occurred");
            console.error(error);
          });
      }
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
    if (!values.branch) {
      errors.branch = "Branch is required!";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      errors.password = "Password cannot exceed more than 10 characters";
    }
    return errors;
  };

  const handleAction = (id, action) => {
    const title =
      action === "deactivate"
        ? "Confirm Staff Deactivation"
        : "Confirm Staff Activation";
    const message =
      action === "deactivate"
        ? "Are you sure you want to deactivate this staff user account?"
        : "Are you sure you want to activate this staff user account?";

    Confirm({
      title: title,
      message: message,
      onConfirm: () => {
        if (action === "deactivate") {
          axios
            .put(`/branch/deactivate/${id}`)
            .then((response) => {
              toast.success("Branch deactivated successfully");
              fetchAllStaff();
            })
            .catch((error) => {
              toast.error("Failed to deactivate branch");
              console.error(error);
            });
        } else if (action === "activate") {
          axios
            .put(`/branch/reactivate/${id}`)
            .then((response) => {
              toast.success("Branch activated successfully");
              fetchAllStaff();
            })
            .catch((error) => {
              toast.error("Failed to activate branch");
              console.error(error);
            });
        }
      },
    });
  };

  const handleEdit = (staff) => {
    setFormValues(staff);
    const selectedbranch = branchOptions.find(   //find the branch of the user from the staff object
      (Option) => Option.value === staff.branchID
    )
    setSelectedOption(selectedbranch || null)
    setModalTitle("Edit Staff Details");
    setModalAction("edit");
    setShow(true);
  };

  const handleAdd = () => {
    setFormValues(initialValues);
    setModalTitle("Add New Staff Account");
    setModalAction("add");
    setShow(true);
  };

  const ModalClose = () => {
    setShow(false); //close the modal
    setFormErrors({}); //clear the form errors if there is any
    setSelectedOption(null)
  };

  return (
    <Container fluid style={{ margin: "20px 0" }}>
      <Row className="d-flex flex-column flex-lg-row">
        {/* All branches table */}
        <Col xs={12} lg={12} className="d-flex justify-content-center">
          <Table
            title={null}
            columns={columns}
            data={allStaff}
            rowsPerPage={10}
            addButton={
              <Button variant="primary" onClick={handleAdd}>
                Add New Staff
              </Button>
            }
          />
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
            {modalAction !== "edit" && (
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
            )}
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
            <div className="text-center">
              <Button
                variant="secondary"
                onClick={ModalClose}
                style={{ marginRight: "10px" }}
              >
                Close
              </Button>
              <Button variant="primary" type="submit">
                {modalAction === "add" ? "Add Staff" : "Save Changes"}
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

export default AdminStaff;
