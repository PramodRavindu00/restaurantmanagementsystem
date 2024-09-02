package com.project.backend.controller;

import com.project.backend.ResourceNotFoundException;
import com.project.backend.model.Reservation;
import com.project.backend.service.CustomerService;
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

    @PostMapping("/addReservation")
    public ResponseEntity<Reservation> addReservation(@RequestBody Reservation reservation)  {
        Reservation newReservation = customerService.addReservation(reservation);
        return new ResponseEntity<>(newReservation, HttpStatus.CREATED);
    }

    @PutMapping("/updateReservation/{id}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable Long id, @RequestBody Reservation reservation) throws  ResourceNotFoundException {
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
