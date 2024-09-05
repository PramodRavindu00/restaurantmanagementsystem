import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";

function AdminProductView() {
  const { productId } = useParams();
  const [product,setProduct] = useState([]);
  const [productLoading, setProductLoading] = useState(true);

  useEffect(() => {
    fetchProduct(productId);
  });

  const fetchProduct = (productId) => {
    axios
      .get(`/products/singleProduct/${productId}`)
      .then((res) => {
        const result = res.data;
        const product = {
            id:result.id,
            productNo:result.productNo,
            productName:result.productName,
            description:result.description,
            price:result.price,
            image:`data:image/jpeg;base64,${result.image}`,
        }
        setProduct(product)
      })
      .catch((error) => {})
      .finally(() => {
        setProductLoading(false);
      });
  };

  return (
    <Container className="my-4" style={{ padding: '0' ,width:"100%"}}>
          <div>
      <Button variant="link" onClick={() => alert('Link button clicked!')}>
        Back
      </Button>
    </div>
        {productLoading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>   ) : (
      <Row>
        <Col xs={12} sm={12} md={12} lg={6} className="mb-4 mx-auto">
        <Image src={product.image}  alt={product.productName} fluid
    
        style={{ width: '100%', height: '60vh' }}
        />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6} className="mb-4 mx-auto"></Col>
      </Row>
      )}
    </Container>
  );
}

export default AdminProductView;
