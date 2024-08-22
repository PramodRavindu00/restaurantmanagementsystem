package com.project.backend.controller;

import com.project.backend.ResourceNotFoundException;
import com.project.backend.model.Branch;
import com.project.backend.model.Reservation;
import com.project.backend.service.ReservationService;
import com.project.backend.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/staff")
public class StaffController {

    @Autowired
    private  ReservationService reservationService;
    @Autowired
    private StaffService staffService;

    @GetMapping("getBranchReservations/{id}/{status}")
  public ResponseEntity<List<Map<String, Object>>> getAllReservations( @PathVariable Long id, @PathVariable String status) {
      List<Map<String, Object>> reservations = reservationService.getAllReservations(id,status);
      return new ResponseEntity<>(reservations, HttpStatus.OK);
  }

  @PutMapping("/acceptReservation/{id}")
    public ResponseEntity<Reservation> acceptReservation(@PathVariable Long id) throws ResourceNotFoundException {
        Reservation reservation = staffService.acceptReservation(id);
        return new ResponseEntity<>(reservation,HttpStatus.OK);
  }

    @PutMapping("/declineReservation/{id}")
    public ResponseEntity<Reservation> declineReservation(@PathVariable Long id) throws ResourceNotFoundException {
        Reservation reservation = staffService.declineReservation(id);
        return new ResponseEntity<>(reservation,HttpStatus.OK);
    }
}
