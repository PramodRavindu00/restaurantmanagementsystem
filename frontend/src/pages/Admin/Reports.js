import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import  Select  from 'react-select';

function Reports() {
  const handleSubmit = () => {};

  return (
    <Container fluid className="p-3">
      <Row className="d-flex justify-content-center">
        <Col xs={12} sm={12} md={10} lg={4} className="mt-2">
          <Form onSubmit={handleSubmit} className="px-2">
            <Form.Group className="text-center mb-3">
              <h3 className="text-center">Generate Reports</h3>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Select From Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Select the date"
                name="date"
                // value={formValues.date}
                // onChange={handleChange}
              />
              <span className="error-message">
                {/* {formErrors.date} */}
                </span>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Select To Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Select the date"
                name="date"
                // value={formValues.date}
                // onChange={handleChange}
              />
              <span className="error-message">
                {/* {formErrors.date} */}
                </span>
            </Form.Group>
            <Form.Group className="mb-2" controlId="formBasicBranch">
              <Form.Label>Branch</Form.Label>
              <Select
                name="branch"
                // options={branchOptions}
                // value={selectedOption}
                // onChange={handleSelectChange}
                placeholder="Select the branch"
              />
              <span className="error-message">
                {/* {formErrors.branch} */}
                </span>
            </Form.Group>
            <Form.Group className="mb-2" controlId="formBasicBranch">
              <Form.Label>Select Branch</Form.Label>
              <Select
                name="branch"
                // options={branchOptions}
                // value={selectedOption}
                // onChange={handleSelectChange}
                placeholder="Select the branch"
              />
              <span className="error-message">
                {/* {formErrors.branch} */}
                </span>
            </Form.Group>
            <Form.Group className="my-4 text-center" controlId="formBasicBranch">
              <Button className="success" type="submit">Generate Report</Button>
              </Form.Group>
          </Form>
        </Col>
        <Col xs={12} sm={12} md={10} lg={8} className="mt-2"></Col>
      </Row>
    </Container>
  );
}

export default Reports;
