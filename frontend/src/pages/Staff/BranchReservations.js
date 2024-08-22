import React, { useState, useEffect } from "react";
import { Accordion, Button, Card, Col, Form, Pagination } from "react-bootstrap";
import axios from "axios";

function BranchReservations() {
  const loggeduser = JSON.parse(localStorage.getItem("user"));

  const [searchPendingText, setPendingSearchText] = useState("");
  const [currentPagePending, setCurentPagePending] = useState(1);
  const [dataPending, setDataPending] = useState([]);
  const [activeKeyPending, setActiveKeyPending] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    axios
      .get(`/staff/getBranchReservations/${loggeduser.branch}/pending`)
      .then((response) => {
        setDataPending(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, [loggeduser.branch]);

  const filteredDataPending = dataPending.filter((item) => {
    return Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchPendingText.toLowerCase())
    );
  });

  const handleTogglePending = (key) => {
    setActiveKeyPending(activeKeyPending === key ? null : key);
  };

  const handlePageChangePending = (pageNumberPending) => {
    setCurentPagePending(pageNumberPending);
  };

  const indexOfLastItemPending = currentPagePending * itemsPerPage;
  const indexOfFirstItemPending = indexOfLastItemPending - itemsPerPage;
  const currentItemsPending = filteredDataPending.slice(
    indexOfFirstItemPending,
    indexOfLastItemPending
  );
  const totalPagesPending = Math.ceil(
    filteredDataPending.length / itemsPerPage
  );

  const handleAccept = (id)=>{
    console.log(`clicked to accept reservation of id ${id}`);
  }

  const handleDecline = (id)=>{
    console.log(`clicked to decline reservation of id ${id}`);
  }

  return (
    <div style={{ margin: "20px auto", width: "90%" }}>
      <div className="row mb-3">
        <div className="col-12 d-flex flex-wrap">
          <div className="col-12 col-md-6 lg-6">
            <h3 className="text-center mb-3">Pending Reservations</h3>
            <div className="col-12 col-md-10 col-lg-10 d-flex mx-auto justify-content-end">
              <div className="col-12 col-md-6 lg-6 mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search pending reservations"
                  value={searchPendingText}
                  onChange={(e) => setPendingSearchText(e.target.value)}
                />
              </div>
            </div>
            <Accordion activeKeyPending={activeKeyPending}>
              {currentItemsPending.map((item, index) => (
                <Col
                  xs={12}
                  md={6}
                  lg={10}
                  key={index}
                  className="mb-3 mx-auto"
                >
                  <Accordion.Item eventKey={index.toString()}>
                    <Card>
                      <Accordion.Header className="acc-header"
                        onClick={() => handleTogglePending(index.toString())}
                      >
                        <span style={{ marginRight: "10px" }} className="acc-header-item">
                          {item.reservationNo}
                        </span>
                        <span style={{ marginRight: "10px" }} className="acc-header-item">
                          {item.date}
                        </span>
                        <span style={{ marginRight: "10px" }} className="acc-header-item">
                          {item.time}
                        </span>
                        <span style={{ marginRight: "10px" }} className="acc-header-item">
                          {item.customerName}
                        </span>
                      </Accordion.Header>
                      <Accordion.Body className="acc-body">
                        <div style={{ marginBottom: "10px" }}><strong>Reservation No : </strong>{item.reservationNo}</div>
                        <div style={{ marginBottom: "10px" }}><strong>Customer Name : </strong>{item.customerName}</div>
                        <div style={{ marginBottom: "10px" }}><strong>Date : </strong>{item.date}</div>
                        <div style={{ marginBottom: "10px" }}><strong>Time : </strong>{item.time}</div>
                        <div style={{ marginBottom: "10px" }}><strong>No of Seats : </strong>{item.seats}</div>
                        <div style={{ marginBottom: "10px" }}><strong>Contact No : </strong>{item.phone}</div>
                        {item.info &&(<div style={{ marginBottom: "10px" }}><strong>Additional Information : </strong>{item.info}</div>)}
                        <div className="d-flex">
                        <Button className="btn btn-success mx-1" onClick={()=>handleAccept(item.id)}>Accept</Button>
                        <Button className="btn btn-danger mx-1" onClick={()=>handleDecline(item.id)}>Decline</Button>
                        </div>
                      </Accordion.Body>
                    </Card>
                  </Accordion.Item>
                </Col>
              ))}
            </Accordion>
            <Pagination className="d-flex justify-content-center mt-3">
              <Pagination.Prev
                disabled={currentPagePending === 1}
                onClick={() => handlePageChangePending(currentPagePending - 1)}
              />
              {Array.from({ length: totalPagesPending }, (_, index) => (
                <Pagination.Item
                  key={index}
                  active={index + 1 === currentPagePending}
                  onClick={() => handlePageChangePending(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPagePending === totalPagesPending}
                onClick={() => handlePageChangePending(currentPagePending + 1)}
              />
            </Pagination>
          </div>
          {/* <div className="col-12 col-md-6 lg-6">
            <h3 className="text-center mb-3">Today Reservations</h3>
            <div className="col-12 col-md-10 col-lg-10 d-flex mx-auto justify-content-end">
            <div className="col-12 col-md-6 lg-6 mb-3">
            <Form.Control
              type="text"
              placeholder="Search pending reservations"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            </div>
            </div>
            <Accordion activeKey={activeKey}>
              {filteredData.map((item, index) => (
                <Col
                  xs={12}
                  md={6}
                  lg={10}
                  key={index}
                  className="mb-3 mx-auto"
                >
                  <Accordion.Item eventKey={index.toString()}>
                    <Card>
                      <Accordion.Header
                        onClick={() => handleToggle(index.toString())}
                      >
                        {Object.keys(item).map((key) => (
                          <span key={key} style={{ marginRight: "10px" }}>
                            {item[key]}
                          </span>
                        ))}
                      </Accordion.Header>
                      <Accordion.Body>
                        {Object.keys(item).map((key) => (
                          <div key={key} style={{ marginBottom: "10px" }}>
                            <strong>{key}:</strong> {item[key]}
                          </div>
                        ))}
                      </Accordion.Body>
                    </Card>
                  </Accordion.Item>
                </Col>
              ))}
            </Accordion>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default BranchReservations;
