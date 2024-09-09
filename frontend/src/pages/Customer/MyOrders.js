import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Pagination,
  Row,
  Spinner,
} from "react-bootstrap";
import Select from "react-select";
import Confirm from "../../components/Confirm";
import { useNavigate } from "react-router-dom";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";

function MyOrders() {
  const loggeduser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const initialValues = {
    customerId: loggeduser.id,
    branch: "",
    orderType: "takeAway",
    orderItems: [],
    payType: "",
    orderValue: "",
    phone: loggeduser.phone,
  };

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurentPage] = useState(1);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [branchOptions, setBranchOptions] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      const userCart = parsedCart.find((cart) => cart.userId === loggeduser.id);
      return userCart ? userCart.items : [];
    }
    return [];
  });

  const itemsPerPage = 5;

  const updateFormValues = useCallback((updatedCart) => {
    const orderValue = updatedCart
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);

    setFormValues((prevValues) => ({
      ...prevValues,
      orderItems: updatedCart,
      orderValue: orderValue,
    }));
  }, []);

  useEffect(() => {
    updateFormValues(cart);
  }, [cart, updateFormValues]);

  const handleIncreaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    updateLocalStorage(updatedCart);
  };

  const handleDecreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
    updateLocalStorage(updatedCart);
  };

  const handleRemoveItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    updateLocalStorage(updatedCart);
  };

  const updateLocalStorage = (updatedCart) => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    const userCartIndex = savedCart.findIndex(
      (cart) => cart.userId === loggeduser.id
    );
    if (userCartIndex !== -1) {
      savedCart[userCartIndex].items = updatedCart;
    }
    localStorage.setItem("cart", JSON.stringify(savedCart));
    updateFormValues(updatedCart);
  };

  const calculateTotal = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setFormValues({ ...formValues, branch: selectedOption.value });
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
    setFormValues({ ...formValues, payType: e.target.value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormValues({ ...formValues, [name]: numericValue.slice(0, 10) });
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

  const clearCart = () => {
    Confirm({
      title: "Confirm Cart Clear",
      message: "Are you sure you want to clear the cart?",
      onConfirm: () => {
        localStorage.removeItem("cart");
        setCart([]);
        updateFormValues([]);
      },
    });
  };

  const clearSubmittedCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
    updateFormValues([]);
  };

  const goToProducts = () => {
    navigate("/customer/customerProducts");
  };

  const validate = (values) => {
    const errors = {};
    if (!values.branch) {
      errors.branch = "Branch is required!";
    }
    if (!values.phone) {
      errors.phone = "Phone no is required!";
    }
    if (!values.payType) {
      errors.payType = "Payment Method is required!";
    }
    return errors;
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      const transformedOrderItems = cart.map((item) => ({
        productNo: item.productNo,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
      }));

      const updatedFormValues = {
        ...formValues,
        orderItems: transformedOrderItems,
      };

      axios
        .post("/customer/submitOrder", updatedFormValues)
        .then((res) => {
          const orderNo = res.data.orderNo;
          toast.success(`Order Submitted. Order No : ${orderNo}`);
          fetchCustomerOrders();
          setFormValues(initialValues);
        })
        .catch((error) => {
          toast.error(`An error occured`);
          console.error(error);
        })
        .finally(() => {
          setSelectedPaymentMethod("");
          setTimeout(() => {
            clearSubmittedCart();
          }, 2000);
        });
    } else {
      console.log("form has errors");
    }
  };

  const fetchCustomerOrders = useCallback(() => {
    axios
      .get(`/customer/getCustomerOrders/${loggeduser.id}`)
      .then((response) => {
        setCustomerOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, [loggeduser.id]);

  useEffect(() => {
    fetchCustomerOrders();
  }, [fetchCustomerOrders]);

  const filteredOrders = customerOrders.filter((item) => {
    return Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const handleToggleOrders = (key) => {
    setActiveKey(activeKey === key ? null : key);
  };

  const handlePageChangeOrders = (pageNumber) => {
    setCurentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <Container className="my-4">
      <Row className="d-flex justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h3 className="text-center"> Cart</h3>
          <Col className="mb-3 d-flex">
            <Button variant="primary" className="mt-3" onClick={goToProducts}>
              Add Items <FontAwesomeIcon icon={faPlus} className="ms-2" />
            </Button>
          </Col>
          {cart.length === 0 ? (
            <Alert variant="warning" className="text-center">
              No items in the cart.
            </Alert>
          ) : (
            cart.map((product) => (
              <Card key={product.id} className="mb-1">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col xs={10} md={4} className="mb-2">
                      <h6>{product.productName}</h6>
                      <p>Rs {product.price}</p>
                    </Col>
                    <Col xs={2} md={1} className="mb-2">
                      <h6 className="mb-1">{product.quantity}</h6>
                    </Col>
                    <Col
                      xs={8}
                      md={4}
                      className="d-flex align-items-center justify-content-evenly mb-1"
                    >
                      <Button
                        className="mb-1"
                        variant="dark"
                        onClick={() => handleDecreaseQuantity(product.id)}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </Button>

                      <Button
                        className="mb-1"
                        variant="dark"
                        onClick={() => handleIncreaseQuantity(product.id)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                      <Button
                        className="mb-1"
                        variant="danger"
                        onClick={() => handleRemoveItem(product.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Col>

                    <Col xs={4} md={3} className="mb-1 text-end">
                      <p>Rs {(product.price * product.quantity).toFixed(2)}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          )}
          {cart.length > 0 && (
            <Col xs={12} sm={12} md={12} lg={12}>
              <h5 className="ms-auto text-end">
                Total : Rs {calculateTotal()}
              </h5>
              <Form onSubmit={handleSubmitOrder}>
                <Row className="d-flex align-items-center">
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className="d-flex flex-column"
                  >
                    <Form.Group controlId="formBasicBranch" className="mb-3">
                      <Form.Label>Select Branch</Form.Label>
                      <Select
                        name="branch"
                        options={branchOptions}
                        value={selectedOption}
                        onChange={handleSelectChange}
                        placeholder="Select the branch"
                      />
                      <span className="error-message">{formErrors.branch}</span>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Contact</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter contact no"
                        name="phone"
                        value={formValues.phone}
                        onChange={handleChange}
                      />
                      <span className="error-message">{formErrors.phone}</span>
                    </Form.Group>
                    <Form.Group controlId="formPaymentMethod">
                      <Form.Label>Select Payment Method</Form.Label>
                      <div className="d-flex flex-column flex-md-row">
                        <Form.Check
                          type="radio"
                          id="paymentCash"
                          name="paymentMethod"
                          label="Cash"
                          value="cash"
                          checked={selectedPaymentMethod === "cash"}
                          onChange={handlePaymentMethodChange}
                        />
                        <Form.Check
                          type="radio"
                          id="paymentCard"
                          name="paymentMethod"
                          label="Card"
                          value="card"
                          checked={selectedPaymentMethod === "card"}
                          onChange={handlePaymentMethodChange}
                          className="mt-2 mt-md-0 ms-md-3"
                        />
                      </div>
                      <span className="error-message">
                        {formErrors.payType}
                      </span>
                    </Form.Group>
                  </Col>
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    className="d-flex flex-column align-items-center mt-3"
                  >
                    <Button
                      variant="success"
                      type="submit"
                      className="mb-2 mx-auto"
                      style={{ width: "50%" }}
                    >
                      Place Order
                    </Button>
                    <Button
                      variant="danger"
                      className="mb-2 mx-auto"
                      style={{ width: "50%" }}
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          )}
        </Col>
        <Col xs={12} md={8} lg={6} className="d-flex flex-column">
          <h3 className="text-center"> My Orders</h3>
          <div className="my-3">
            <Form.Control
              type="text"
              placeholder="Search your orders"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : filteredOrders.length === 0 ? (
            <Alert variant="warning" className="text-center">
              No data found.
            </Alert>
          ) : (
            <Accordion activeKey={activeKey}>
              {currentItems.map((item, index) => (
                <Accordion.Item
                  eventKey={index.toString()}
                  className="mb-2"
                  key={item.id}
                >
                  <Card>
                    <Accordion.Header
                      onClick={() => handleToggleOrders(index.toString())}
                    >
                      <Row className="d-flex my-2 justify-content-between px-2  align-items-center">

                      </Row>
                      <Col xs={4}>
                      <span
                        className="acc-header-item"
                      >
                        {item.orderNo}
                      </span></Col>
                      <Col xs={4}>
                      <span
                        className="acc-header-item"
                      >
                        {item.orderDate}
                      </span></Col>
                      <Col xs={4}>
                      <span
                        className="acc-header-item"
                      >
                        {item.branch}
                      </span></Col>
                    </Accordion.Header>
                    <Accordion.Body className="p-3 bg-light rounded">
                      <div className="mb-2">
                        <strong>Order Type: </strong>
                        <span
                          className={
                            item.orderType === "takeAway"
                              ? "badge bg-primary p-2"
                              : "badge bg-success p-2"
                          }
                        >
                          {item.orderType === "takeAway"
                            ? "Take Away"
                            : "Delivery"}
                        </span>
                      </div>

                      <div className="mb-2">
                        <strong>Payment Method: </strong>
                        <span
                          className={
                            item.payType === "card"
                              ? "badge bg-info p-2"
                              : "badge bg-warning p-2"
                          }
                        >
                          {item.payType === "card" ? "Card" : "Cash"}
                        </span>
                      </div>
                      <div className="mb-2">
                        <strong>Contact No: </strong>
                        <span className="text-muted">{item.phone}</span>
                      </div>
                      <hr />
                      <div className="text-center mb-3">
                        <h6>
                          <strong>Ordered Items</strong>
                        </h6>
                      </div>
                      <div className="mb-3">
                        <Row className="d-flex my-2 justify-content-between p-1  align-items-center">
                          <Col xs={1} className="p-0 fw-bold">No</Col>
                          <Col xs={5} className="p-0 fw-bold">Product Name</Col>
                          <Col xs={2} className="p-0 text-end fw-bold">Qty</Col>
                          <Col xs={4} className="p-0 text-end fw-bold">Sub Total</Col>
                        </Row>
                        {item.orderItems && item.orderItems.length > 0 ? (
                          item.orderItems.map((orderItem, index) => (
                            <Row
                              className="d-flex my-2 justify-content-between  align-items-center p-1 bg-white border rounded"
                              key={index}
                            >
                              <Col xs={1} className="p-0">
                                <p>{index + 1}.</p>
                              </Col>
                              <Col xs={5} className="p-0">
                                <p>{orderItem.productName}</p>
                              </Col>
                              <Col xs={2} className="p-0 text-end">
                                <p>{orderItem.quantity}</p>
                              </Col>
                              <Col xs={4} className="p-0 text-end">
                                <p className="text-success">
                                  {(
                                    orderItem.price * orderItem.quantity
                                  ).toFixed(2)}
                                </p>
                              </Col>
                            </Row>
                          ))
                        ) : (
                          <div className="text-center text-danger">
                            <strong>No items found in this order</strong>
                          </div>
                        )}
                      </div>
                      <hr />
                      <div className="text-end mb-2">
                        <h6>
                          Grand Total :{" "}
                          <span className="text-primary">
                            Rs {item.orderValue.toFixed(2)}
                          </span>
                        </h6>
                      </div>
                    </Accordion.Body>
                  </Card>
                </Accordion.Item>
              ))}
            </Accordion>
          )}
          {filteredOrders.length > 0 && (
            <Pagination className="d-flex justify-content-center mt-3">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => handlePageChangeOrders(currentPage - 1)}
              />
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChangeOrders(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => handlePageChangeOrders(currentPage + 1)}
              />
            </Pagination>
          )}
        </Col>
      </Row>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Container>
  );
}

export default MyOrders;
