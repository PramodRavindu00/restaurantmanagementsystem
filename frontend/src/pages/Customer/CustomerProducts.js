import { faCartPlus, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Carousel,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {ToastContainer, toast } from "react-toastify";

function CustomerProducts() {
  const loggeduser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [productsLoading, setProductsLoading] = useState(true);
  const [allProducts, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      const userCart = parsedCart.find((cart) => cart.userId === loggeduser.id);
      return userCart ? userCart.items : [];
    }
    return [];
  });

  const [addedProduct, setAddedProduct] = useState(null);
  const [alreadyAdded, setAlreadyadded] = useState(false);

  const fetchProducts = useCallback(() => {
    axios
      .get("/products/allProducts")
      .then((response) => {
        const result = response.data.map((item) => ({
          id: item.id,
          productNo: item.productNo,
          productName: item.productName,
          price: formatPrice(item.price),
          image: `data:image/jpeg;base64,${item.image}`,
          description: item.description,
        }));
        setProducts(result);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setProductsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const formatPrice = (price) => parseFloat(price).toFixed(2);

  const filteredProducts = allProducts.filter((product) =>
    product.productName.toLowerCase().includes(searchText.toLowerCase())
  );

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (existingProduct) {
        setAddedProduct(product.productName);
        setAlreadyadded(true);
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        setAddedProduct(product.productName);
        setAlreadyadded(false);
        return [
          ...prevCart,
          {
            id: product.id,
            productNo: product.productNo,
            productName: product.productName,
            price: product.price,
            quantity: 1,
          },
        ];
      }
    });
  };

  useEffect(() => {
    if (addedProduct !== null) {
      if (alreadyAdded) {
        toast.success(
          `${addedProduct} is already in the cart. Quantity increased by 1`
        );
      } else {
        toast.success(`${addedProduct} is succesfully added to the cart`);
      }
    }
  }, [addedProduct, alreadyAdded]);

  useEffect(() => {
    if (cart.length > 0) {
      const savedCart = localStorage.getItem("cart");
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      const userCartIndex = parsedCart.findIndex(
        (cart) => cart.userId === loggeduser.id
      );

      if (userCartIndex !== -1) {
        parsedCart[userCartIndex].items = cart;
      } else {
        parsedCart.push({ userId: loggeduser.id, items: cart });
      }
      localStorage.setItem("cart", JSON.stringify(parsedCart));
    }
  }, [cart, loggeduser]);

  const goToCart = () => {
    navigate("/customer/myorders");
  };

  return (
    <Container className="my-4">
      <Row>
        <Col className="mb-4">
          <div className="col-12 d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
              <Button variant="primary" onClick={goToCart}>
                Go to Cart
                <FontAwesomeIcon icon={faCartShopping} className="ms-2" />
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
            <Col key={product.id} xs={12} sm={6} md={4} lg={4} className="mb-4">
              <Card style={{ width: "100%" }}>
                <Card.Body>
                  <Carousel interval={null}>
                    <Carousel.Item>
                      <img
                        className="d-block w-100"
                        src={product.image}
                        alt={product.productName}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    </Carousel.Item>
                    <Carousel.Item>
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: "200px", backgroundColor: "#f8f9fa" }}
                      >
                        <p>{product.description}</p>
                      </div>
                    </Carousel.Item>
                  </Carousel>
                  <Card.Title>{product.productName}</Card.Title>
                  <div className="d-flex align-items-center">
                    <Card.Text>{`Rs ${product.price}`}</Card.Text>
                    <Button
                      variant="success"
                      className="ms-auto"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                      <FontAwesomeIcon icon={faCartPlus} className="ms-2" />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

<ToastContainer
        position="top-right"
        autoClose={1200}
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

export default CustomerProducts;
