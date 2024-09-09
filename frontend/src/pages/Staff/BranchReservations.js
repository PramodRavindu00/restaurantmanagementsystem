import React, { useState, useEffect, useCallback } from "react";
import {
  Accordion,
  Button,
  Card,
  Col,
  Form,
  Pagination,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import Confirm from "../../components/Confirm";
import { Bounce, toast, ToastContainer } from "react-toastify";

function BranchReservations() {
  const loggeduser = JSON.parse(localStorage.getItem("user"));

  const [searchPendingText, setPendingSearchText] = useState("");
  const [currentPagePending, setCurentPagePending] = useState(1);
  const [dataPending, setDataPending] = useState([]);
  const [activeKeyPending, setActiveKeyPending] = useState(null);

  const [searchTodayText, setTodaySearchText] = useState("");
  const [currentPageToday, setCurentPageToday] = useState(1);
  const [dataToday, setDataToday] = useState([]);
  const [activeKeyToday, setActiveKeyToday] = useState(null);

  const itemsPerPage = 5;

//pending reservations
  const fetchPendingBranchReservations = useCallback(() => {
    axios
      .get(`/staff/getBranchReservations/${loggeduser.branch}/pending`)
      .then((response) => {
        setDataPending(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  },[loggeduser.branch]);

  useEffect(() => {
    fetchPendingBranchReservations();
  },[fetchPendingBranchReservations]);

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

  const handleAccept = (id) => {
    Confirm({
      title: "Accept Reservation",
      message: "Are you sure you want to accept this reservation?",
      onConfirm: () => {
        setActiveKeyPending(null);
        axios
          .put(`/staff/acceptReservation/${id}`)
          .then((res) => {
            toast.success("Reservation Accepted");
            fetchPendingBranchReservations();
          
          })
          .catch((error) => {
            if (error.response.status === 404) {
              toast.error("Reservation Not Found");
            } else if (error.response.status === 400) {
              toast.error("not a pending status");
            } else if (error.response.status === 500) {
              toast.error("an error occurred");
            } else {
              toast.error("an error occurred");
            }
          });
      },
    });
  };

  const handleDecline = (id) => {
    Confirm({
      title: "Decline Reservation",
      message: "Are you sure you want to decline this reservation?",
      onConfirm: () => {
        setActiveKeyPending(null);
        axios
          .put(`/staff/declineReservation/${id}`)
          .then((res) => {
            toast.success("Reservation Declined");
            fetchPendingBranchReservations();
          })
          .catch((error) => {
            if (error.response.status === 404) {
              toast.error("Reservation Not Found");
            } else if (error.response.status === 400) {
              toast.error("not a pending status");
            } else if (error.response.status === 500) {
              toast.error("an error occurred");
            } else {
              toast.error("an error occurred");
            }
          });
      },
    });
  };

  // reservations for today
  const fetchTodayBranchReservations = useCallback(() => {
    axios
      .get(`/staff/todayBranchReservations/${loggeduser.branch}`)
      .then((response) => {
        setDataToday(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  },[loggeduser.branch]);

  useEffect(() => {
    fetchTodayBranchReservations();
  },[fetchTodayBranchReservations]);

  const filteredDataToday = dataToday.filter((item) => {
    return Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTodayText.toLowerCase())
    );
  });

  const handleToggleToday = (key) => {
    setActiveKeyToday(activeKeyToday === key ? null : key);
  };

  const handlePageChangeToday = (pageNumberToday) => {
    setCurentPageToday(pageNumberToday);
  };

  const indexOfLastItemToday = currentPageToday * itemsPerPage;
  const indexOfFirstItemToday = indexOfLastItemToday - itemsPerPage;

  const currentItemsToday = filteredDataToday.slice(
    indexOfFirstItemToday,
    indexOfLastItemToday
  );

  const totalPagesToday = Math.ceil(
    filteredDataToday.length / itemsPerPage
  ); 
  return (
    <div>
      <div className="row m-3">
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

            {filteredDataPending.length === 0 ? (
              <Alert variant="warning" className="text-center mx-4">
                No pending reservations found.
              </Alert>
            ) : (
              <Accordion activeKey={activeKeyPending}>
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
                        <Accordion.Header
                          onClick={() => handleTogglePending(index.toString())}
                        >
                          <span
                            style={{ marginRight: "10px" }}
                            className="acc-header-item"
                          >
                            {item.reservationNo}
                          </span>
                          <span
                            style={{ marginRight: "10px" }}
                            className="acc-header-item"
                          >
                            {item.date}
                          </span>
                          <span
                            style={{ marginRight: "10px" }}
                            className="acc-header-item"
                          >
                            {item.time}
                          </span>
                          <span
                            style={{ marginRight: "10px" }}
                            className="acc-header-item"
                          >
                            {item.customerName}
                          </span>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div style={{ marginBottom: "10px" }}>
                            <strong>Reservation No : </strong>
                            {item.reservationNo}
                          </div>
                          <div style={{ marginBottom: "10px" }}>
                            <strong>Customer Name : </strong>
                            {item.customerName}
                          </div>
                          <div style={{ marginBottom: "10px" }}>
                            <strong>Date : </strong>
                            {item.date}
                          </div>
                          <div style={{ marginBottom: "10px" }}>
                            <strong>Time : </strong>
                            {item.time}
                          </div>
                          <div style={{ marginBottom: "10px" }}>
                            <strong>No of Seats : </strong>
                            {item.seats}
                          </div>
                          <div style={{ marginBottom: "10px" }}>
                            <strong>Contact No : </strong>
                            {item.phone}
                          </div>
                          {item.info && (
                            <div style={{ marginBottom: "10px" }}>
                              <strong>Additional Information : </strong>
                              {item.info}
                            </div>
                          )}
                          <div className="d-flex">
                            <Button
                              className="btn btn-success mx-1"
                              onClick={() => handleAccept(item.id)}
                            >
                              Accept
                            </Button>
                            <Button
                              className="btn btn-danger mx-1"
                              onClick={() => handleDecline(item.id)}
                            >
                              Decline
                            </Button>
                          </div>
                        </Accordion.Body>
                      </Card>
                    </Accordion.Item>
                  </Col>
                ))}
              </Accordion>
            )}

            {filteredDataPending.length > 0 && (
              <Pagination className="d-flex justify-content-center mt-3">
                <Pagination.Prev
                  disabled={currentPagePending === 1}
                  onClick={() =>
                    handlePageChangePending(currentPagePending - 1)
                  }
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
                  onClick={() =>
                    handlePageChangePending(currentPagePending + 1)
                  }
                />
              </Pagination>
            )}
          </div>
          <div className="col-12 col-md-6 lg-6">
            <h3 className="text-center mb-3">Reservations of Today</h3>
            <div className="col-12 col-md-10 col-lg-10 d-flex mx-auto justify-content-end">
              <div className="col-12 col-md-6 lg-6 mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search today reservations"
                  value={searchTodayText}
                  onChange={(e) => setTodaySearchText(e.target.value)}
                />
              </div>
            </div>

            {filteredDataToday.length === 0 ? (
              <Alert variant="warning" className="text-center mx-4">
                No reservations found for today.
              </Alert>
            ) : (
              <Accordion activeKey={activeKeyToday}>
                {currentItemsToday.map((item, index) => (
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
                          onClick={() => handleToggleToday(index.toString())}
                        >
                          <span
                            style={{ marginRight: "10px" }}
                            className="acc-header-item"
                          >
                            {item.reservationNo}
                          </span>
                          <span
                            style={{ marginRight: "10px" }}
                            className="acc-header-item"
                          >
                            {item.date}
                          </span>
                          <span
                            style={{ marginRight: "10px" }}
                            className="acc-header-item"
                          >
                            {item.time}
                          </span>
                          <span
                            style={{ marginRight: "10px" }}
                            className="acc-header-item"
                          >
                            {item.customerName}
                          </span>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div style={{ marginBottom: "10px" }}>
                            <strong>Reservation No : </strong>
                            {item.reservationNo}
                          </div>
                          <div style={{ marginBottom: "10px" }}>
                            <strong>Customer Name : </strong>
                            {item.customerName}
                          </div>
                          <div style={{ marginBottom: "10px" }}>
                            <strong>Date : </strong>
                            {item.date}
                          </div>
                          <div style={{ marginBottom: "10px" }}>
                            <strong>Time : </strong>
                            {item.time}
                          </div>
                          <div style={{ marginBottom: "10px" }}>
                            <strong>No of Seats : </strong>
                            {item.seats}
                          </div>
                          <div style={{ marginBottom: "10px" }}>
                            <strong>Contact No : </strong>
                            {item.phone}
                          </div>
                          {item.info && (
                            <div style={{ marginBottom: "10px" }}>
                              <strong>Additional Information : </strong>
                              {item.info}
                            </div>
                          )}
                          <div className="d-flex">
                            
                          </div>
                        </Accordion.Body>
                      </Card>
                    </Accordion.Item>
                  </Col>
                ))}
              </Accordion>
            )}

            {filteredDataToday.length > 0 && (
              <Pagination className="d-flex justify-content-center mt-3">
                <Pagination.Prev
                  disabled={currentPageToday === 1}
                  onClick={() =>
                    handlePageChangeToday(currentPageToday - 1)
                  }
                />
                {Array.from({ length: totalPagesToday }, (_, index) => (
                  <Pagination.Item
                    key={index}
                    active={index + 1 === currentPageToday}
                    onClick={() => handlePageChangeToday(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPageToday === totalPagesToday}
                  onClick={() =>
                    handlePageChangeToday(currentPageToday + 1)
                  }
                />
              </Pagination>
            )}
          </div>
        </div>
      </div>
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

export default BranchReservations;
