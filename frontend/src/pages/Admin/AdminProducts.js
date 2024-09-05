import React, { useEffect, useState } from "react";
import { Form, Button, Card, Row, Col, Container, Alert, Spinner } from "react-bootstrap";
import Model from "../../components/Model";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BasicSpinner } from './../../components/Utils';

function AdminProducts() {

  const initialValues = {
    productName: "",
    price: "",
    description: "",
    image: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [searchText, setSearchText] = useState("");
  const [show, setShow] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [count, setCharCount] = useState(100);
  const [submitmessage, setSubmitMessage] = useState("");
  const [messageClass, setMessageClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true)
  const [allProducts,setProducts] = useState([]);

const navigate = useNavigate();

  useEffect(() => {
    fetchProducts(); //display all products
  });

  const fetchProducts = () => {
    axios
      .get("/products/allProducts")
      .then((response) => {
        console.log(response);
        
        const result = response.data.map((item) => ({
          id: item.id,
          productName: item.productName,
          price: formatPrice(item.price),
          image: `data:image/jpeg;base64,${item.image}`,  //convert the byte size array into a JPG
        }));
        setProducts(result);
      })
      .catch((error) => console.error(error))
      .finally(()=>{setProductsLoading(false)});
  };

  const formatPrice = price =>parseFloat(price).toFixed(2);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
      const numericValue = value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*)\./g, "$1");
      setFormValues({ ...formValues, [name]: numericValue });
    } else if (name === "description") {
      if (value.length <= 100) {
        setFormValues({ ...formValues, [name]: value });
        setCharCount(100 - value.length);
      }
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormValues({ ...formValues, image: file });
    }
  };


  

  const handleAdd = () => {
    setShow(true);
    setFormValues(initialValues);
    setSubmitMessage("");
  };

  const ModalClose = () => {
    setShow(false);
    setFormValues(initialValues);
    setSubmitMessage("");
    setFormErrors({});
    setCharCount(100);
  };

  const validate = (values) => {
    const errors = {};
    if (!values.productName) {
      errors.productName = "Product Name is required!";
    }
    if (!values.description) {
      errors.description = "Description is required!";
    }
    if (!values.price) {
      errors.price = "Price is required!";
    }
    if (!values.image) {
      errors.image = "Image is required!";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    console.log(formValues);

    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      // if (modalAction === "add") {
      axios
        .post("/admin/addProduct", formValues, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          const productNo = res.data;
          setLoading(false);
          setFormValues(initialValues);
          setMessageClass("text-success");
          setSubmitMessage(
            `New Product has been added.Product No : ${productNo}`
          );
          setTimeout(() => {
            setShow(false);
          }, 2000);
          fetchProducts();
        })
        .catch((error) => {
          setLoading(false);

          if (error.response && error.response.data) {
            console.log(error.response);

            if (error.response.data === "ProductExist") {
              setFormErrors({
                ...errors,
                productName: "Product Name is existing. Try a different name",
              });
              setFormValues({ ...formValues, productName: "" });
            } else {
              setMessageClass("text-danger");
              setSubmitMessage("An error occured!!! Try again later");
            }
          }
        });
      // } else if (modalAction === "edit") {
      // axios.put(`/user/edit/${formValues.id}`, formValues)
      //   .then((res) => {
      //     toast.success("Staff details updated successfully");
      //     setFormValues(initialValues);
      //     fetchAllStaff();
      //     setShow(false);
      //   })
      //   .catch((error) => {
      //     if (error.response && error.response.data) {
      //       if (error.response.data === "EMAIL") {
      //         setFormErrors({
      //           ...errors,
      //           email: "Email is already registered with another account",
      //         });
      //         setFormValues({ ...formValues, email: "" });
      //       }
      //       if (error.response.data === "PHONE") {
      //         setFormErrors({
      //           ...errors,
      //           phone: "Phone number is already using with another account",
      //         });
      //         setFormValues({ ...formValues, phone: "" });
      //       }
      //     } else {
      //       toast.error("An error occurred");
      //     }
      //   });
      // }
    } else {
      console.log("form has erros");
    }
  };

  const filteredProducts = allProducts.filter((product) =>
    product.productName.toLowerCase().includes(searchText.toLowerCase())
  );

  const hanldeViewMore = (productID) => {
    navigate(`/admin/adminproducts/${productID}`);
  }

  return (
    <Container className="my-4">
      <Row>
        <Col className="mb-4">
          <div className="col-12 d-flex flex-column flex-md-row justify-content-between">
            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
              <Button variant="primary" onClick={handleAdd}>
                Add Product
              </Button>
            </div>
            <div className="col-12 col-md-6 col-lg-6">
              <input
                type="text"
                placeholder="Search Product"
                 value={searchText}
                className="form-control"
                 onChange={(e) => setSearchText(e.target.value)}
                style={{ margin: "10px 0", padding: "5px" }}
              />
            </div>
          </div>
        </Col>
      </Row>
      {productsLoading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Alert variant="warning" className="text-center">
          No Products Found.
        </Alert>
      ) : (
      <Row>
        {filteredProducts.map((product) => (
          <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card style={{ width: "100%" }}>
              <Card.Img variant="top" src={product.image} alt={product.productName} 
              style={{ width: "100%", height: "200px", objectFit: "cover" }}/>
              <Card.Body>
                <Card.Title>{product.productName}</Card.Title>
                <Card.Text>{`Rs ${product.price}`}</Card.Text>
                <Button variant="primary" onClick={()=>hanldeViewMore(product.id)}>View More....</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
            )}
      {/* Modal */}
      <Model
        title={
          <Form.Group className="text-center">
            <h2>Add New Product</h2>
          </Form.Group>
        }
        body={
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Product name"
                name="productName"
                value={formValues.productName}
                onChange={handleChange}
              />
              <span className="error-message">{formErrors.productName}</span>
            </Form.Group>
            <Form.Group className="mb-2" controlId="formBasicDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter product description"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                rows={3}
              />
              <div className="text-muted">{count} characters remaining</div>
              <span className="error-message">{formErrors.description}</span>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPrice">
              <Form.Label>Price (Rs)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Price"
                name="price"
                value={formValues.price}
                onChange={handleChange}
              />
              <span className="error-message">{formErrors.price}</span>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/jpeg, image/png"
                onChange={(e) => handleFileChange(e)}
              />
              <span className="error-message">{formErrors.image}</span>
            </Form.Group>
            <Form.Group className="mb-2 text-center">
              <span className={messageClass}>{submitmessage}</span>
              {loading && <BasicSpinner />}
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
                Add Product
              </Button>
            </div>
          </Form>
        }
        footer={null}
        show={show}
        close={ModalClose}
      />
    </Container>
  );
}

export default AdminProducts;
