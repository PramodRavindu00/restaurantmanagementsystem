import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./../../styles/form.css";
import Table from "./../../components/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faRedo, faBan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Confirm from "./../../components/Confirm";
import Model from "../../components/Model";

function Branch() {
  //initial values of the form fields
  const initialValues = {
    name: "",
    location: "",
    active: true,
  };

  const [allbranches, setBranches] = useState([]);
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [modalTitle, setModalTitle] = useState("");
  const [modalAction, setModalAction] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetchBranches(); //display all branches
  }, []);

  const fetchBranches = () => {
    axios
      .get("/branch/allBranch")
      .then((response) => {
        const result = response.data.map((item) => ({
          id: item.id,
          name: item.name,
          location: item.location,
          active: item.active,
        }));

        setBranches(result);
      })
      .catch((error) => console.error(error));
  };

  const handleAction = (id, action) => {
    const title =
      action === "deactivate"
        ? "Confirm Branch Deactivation"
        : "Confirm Branch Activation";
    const message =
      action === "deactivate"
        ? "Are you sure you want to deactivate this branch?"
        : "Are you sure you want to activate this branch?";

    Confirm({
      title: title,
      message: message,
      onConfirm: () => {
        if (action === "deactivate") {
          axios
            .put(`/branch/deactivate/${id}`)
            .then((response) => {
              toast.success("Branch deactivated successfully");
              fetchBranches();
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
              fetchBranches();
            })
            .catch((error) => {
              toast.error("Failed to activate branch");
              console.error(error);
            });
        }
      },
    });
  };
  //columns and data objects for the table
  const columns = [
    {
      name: "No",
      selector: (row) => row.id, //selector function extract the relavnt data
      sortable: true,
    },
    {
      name: "Branch Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
    },
    {
      name: "Edit",
      cell: (row) => (
        <Button
          onClick={() => handleEdit(row)} //getting the single branch object as the paramter
          variant="warning"
          title="Edit branch details"
        >
          <FontAwesomeIcon icon={faEdit} />
        </Button>
      ),
    },
   {
      name: "Action",
      cell: (row) => (
        <>
          {row.active ? (
            <Button
              onClick={() => handleAction(row.id, "deactivate")}
              variant="danger"
              title="Deactivate Branch"
            >
              <FontAwesomeIcon icon={faBan} />
            </Button>
          ) : (
            <Button
              onClick={() => handleAction(row.id, "activate")}
              variant="success"
              title="Reactivate Branch"
            >
              <FontAwesomeIcon icon={faRedo} />
            </Button>
          )}
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
            fetchBranches();
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
            fetchBranches();
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
      }
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Branch name is required!";
    }
    if (!values.location) {
      errors.location = "Location is required!";
    }
    return errors;
  };


  const handleEdit = (branch) => {
    setFormValues(branch);
    setModalTitle("Edit Branch Details");
    setModalAction("edit");
    setShow(true);
  };

  const handleAdd = () => {
    setFormValues(initialValues);
    setModalTitle("Add New Branch");
    setModalAction("add");
    setShow(true);
  };

  const ModalClose = () => {
    setShow(false); //close the modal
    setFormErrors({}); //clear the form errors if there is any
  };

  return (
    <Container fluid style={{ margin: "20px 0" }}>
      <Row className="d-flex flex-column flex-lg-row">
        {/* All branches table */}
        <Col xs={12} lg={12} className="d-flex justify-content-center">
          <Table
            title={null}
            columns={columns}
            data={allbranches}
            rowsPerPage={10}
            addButton={
              <Button variant="primary" onClick={handleAdd}>
                Add Branch
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
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Branch Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter branch name"
                name="name"
                value={formValues.name}
                onChange={handleChange}
              />
              <span className="error-message">{formErrors.name}</span>
            </Form.Group>
            <Form.Group className="mb-5" controlId="formBasicLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                name="location"
                value={formValues.location}
                onChange={handleChange}
              />
              <span className="error-message">{formErrors.location}</span>
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
                {modalAction === "add" ? "Add Branch" : "Save Changes"}
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

export default Branch;
