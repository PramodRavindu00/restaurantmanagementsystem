import axios from "axios";
import React, { useCallback, useEffect,
  //  useRef,
    useState } from "react";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";

function AdminProductView() {
  // const fileInputRef = useRef(null);
  const { productId } = useParams();
  const [product, setProduct] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [count, setCharCount] = useState(100);
  const [initialValues, setInitialValues] = useState({});
  const [formValues, setFormValues] = useState({});
  // const [image, setImage] = useState({});

  const navigate = useNavigate();

  const formatPrice = (price) => parseFloat(price).toFixed(2);

  const fetchProduct = useCallback((productId) => {
    axios
      .get(`/products/singleProduct/${productId}`)
      .then((res) => {
        const result = res.data;
        const product = {
          id: result.id,
          productNo: result.productNo,
          productName: result.productName,
          description: result.description,
          price: formatPrice(result.price),
          image: `data:image/jpeg;base64,${result.image}`,
        };
        setProduct(product);
        setFormValues({
          productName: product.productName,
          price: product.price,
          description: product.description,
        });

        setInitialValues({
          productName: product.productName,
          price: product.price,
          description: product.description,
        });
        setCharCount(100 - product.description.length);
      })
      .catch((error) => {})
      .finally(() => {
        setProductLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchProduct(productId);
  }, [fetchProduct, productId]);

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

  const resetFormValues = () => {
    setFormValues(initialValues);
    setFormErrors("");
  };

  // const handleImageChange = () => {
  //   fileInputRef.current.click();
  // };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setImage({ ...image, imageFile: file });
  //     console.log(image);
      
  //   }

  //   if (file) {
   
  //     axios
  //       .put(`/admin/productImageChange/${productId}`, image,{
  //         headers: {
  //             'Content-Type': 'multipart/form-data'
  //         }})
  //       .then((res) => {
  //         console.log(res.status);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       })
  //       .finally(() => {
  //         fetchProduct(productId);
  //       });
  //   }
  // };

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
    return errors;
  };

  const handleEdit = (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {

      axios
        .put(`/admin/editProduct/${productId}`, formValues)
        .then((res) => {
          toast.success('Product details updated');
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            if (error.response.data === "ProductExist") {
              setFormErrors({
                ...errors,
                productName: "Product Name is existing. Try a different name",
              });
              setFormValues({ ...formValues, productName: product.productName });
            } else {
              toast.error('An error occured');
          }
        }else{
          toast.error('An error occured');
        }}).finally(()=>{
          fetchProduct(productId);
        })
     
    } else {
      console.log("form has erros");
    }
  };

  return (
    <div className="m-4 mx-auto" style={{ width: "90%" }}>
      <div className="mb-2">
        <Button
          variant="link"
          onClick={() => navigate(-1)}
          style={{
            fontSize: "1.1rem",
            textDecoration: "none",
            color: "#DAA520",
          }}
        >
          Back to Products
        </Button>
      </div>
      {productLoading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Row className="d-flex justify-content-center align-items-center">
          <Col key={product.id} xs={12} sm={10} md={10} lg={4} className="mb-4">
            <Card style={{ width: "100%" }}>
              <Card.Img
                variant="top"
                src={product.image}
                alt={product.productName}
                style={{ width: "100%", height: "312px" }}
              />
            </Card>
            {/* <div className="mt-4  d-flex justify-content-center align-items-center">
              <Form>
              <Form.Control
                type="file"
                name="image"
                accept="image/jpeg, image/png"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e)}
                // style={{ display: "none" }}
              />
              <Form.Group className="mb-2 text-center"></Form.Group>
              <Button
                variant="dark"
                className="ms-3"
                onClick={handleImageChange}
              >
                Change Image
              </Button>
              </Form>
            </div> */}
          </Col>
          <Col xs={12} sm={10} md={10} lg={4} className="mb-4">
            <Form onSubmit={handleEdit}>
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
              <Form.Group className="mb-2 text-center"></Form.Group>
              <div className="mt-4 text-center">
                <Button variant="secondary" onClick={resetFormValues}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="ms-3">
                  Save Changes
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      )}

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

export default AdminProductView;
