package com.project.backend.controller;

import com.project.backend.ResourceNotFoundException;
import com.project.backend.model.Reservation;
import com.project.backend.service.BranchService;
import com.project.backend.service.CustomerService;
import com.project.backend.service.EmailService;
import com.project.backend.service.UserService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customer")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private BranchService branchService;

    @Autowired
    private UserService userService;

    @PostMapping("/addReservation")
    public ResponseEntity<Reservation> addReservation(@RequestBody Reservation reservation) throws MessagingException {
        Reservation newReservation = customerService.addReservation(reservation);

//        Long customerID = reservation.getCustomerID();
//        String name = userService.findUserNameByID(customerID);
//        String message = "Your reservation has been successfully added.<br>" +
//                    "Reservation details<br>" +
//                    "Reservation No: " + newReservation.getReservationNo() + "<br>" +
//                    "Selected Branch : " + branchService.findBranchNameByID(newReservation.getBranch()) + "<br>" +
//                    "Date : " +newReservation.getDate() + "<br>" +
//                    "Time : " +newReservation.getTime() + "<br>" +
//                    "No of seats : " +newReservation.getSeats() + "<br>" +
//                    "Contact no : " +newReservation.getPhone() + "<br>";
//            String htmlContent = new EmailContent().emailHtml(name, message);
//            // Send email
//            emailService.sendSimpleMail(userService.findUserEmailByID(customerID), "Reservation Received", htmlContent);
        return new ResponseEntity<>(newReservation, HttpStatus.CREATED);
    }

    @PutMapping("/updateReservation/{id}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable Long id, @RequestBody Reservation reservation) throws MessagingException, ResourceNotFoundException {
        Reservation updatedReservation = customerService.updateReservation(id,reservation);
        return new ResponseEntity<>(updatedReservation, HttpStatus.OK);
    }

    @PutMapping("/cancelReservation/{id}")
    public ResponseEntity<Reservation> cancelReservation(@PathVariable Long id) throws ResourceNotFoundException {
        Reservation cancelledReservation = customerService.cancelReservation(id);
        return new ResponseEntity<>(cancelledReservation, HttpStatus.OK);
    }

    @GetMapping("/getCustomerReservations/{id}")
    private ResponseEntity<List<Map<String, Object>>> getCustomerReservations(@PathVariable Long id){
        List<Map<String, Object>> customerReservations = customerService.getCustomerReservations(id);
        return new ResponseEntity<>(customerReservations, HttpStatus.OK);
    }
}
