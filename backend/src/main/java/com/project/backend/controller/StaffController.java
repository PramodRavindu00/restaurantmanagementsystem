package com.project.backend.controller;

import com.project.backend.ResourceNotFoundException;
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

    @GetMapping("/getBranchReservations/{id}/{status}")
  public ResponseEntity<List<Map<String, Object>>> getAllReservations( @PathVariable Long id, @PathVariable String status) {
      List<Map<String, Object>> reservations = reservationService.getAllReservations(id,status);
      return new ResponseEntity<>(reservations, HttpStatus.OK);
  }

  @PutMapping("/acceptReservation/{id}")
    public ResponseEntity<String> acceptReservation(@PathVariable Long id) {
       try{
           Reservation reservation = staffService.acceptReservation(id);
           return new ResponseEntity<>("accepted",HttpStatus.OK);
       }
       catch(ResourceNotFoundException e){
           return new ResponseEntity<>("not found",HttpStatus.NOT_FOUND);
       }
       catch (RuntimeException e){
           String error = e.getMessage();
           if (error.contains("notPending")){
               return new ResponseEntity<>("not a pending reservation",HttpStatus.BAD_REQUEST);
           } else if (error.contains("failed")) {
               return new ResponseEntity<>("failed to save or email",HttpStatus.INTERNAL_SERVER_ERROR);
           }
           return new ResponseEntity<>("an error occurred",HttpStatus.INTERNAL_SERVER_ERROR);
       }
  }

    @PutMapping("/declineReservation/{id}")
    public ResponseEntity<String> declineReservation(@PathVariable Long id){
        try{
            Reservation reservation = staffService.declineReservation(id);
            return new ResponseEntity<>("declined",HttpStatus.OK);
        } catch(ResourceNotFoundException e){
            return new ResponseEntity<>("not found",HttpStatus.NOT_FOUND);
        }
        catch (RuntimeException e){
            String error = e.getMessage();
            if (error.contains("notPending")){
                return new ResponseEntity<>("not a pending reservation",HttpStatus.BAD_REQUEST);
            } else if (error.contains("failed")) {
                return new ResponseEntity<>("failed to save or email",HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>("an error occurred",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/todayBranchReservations/{id}")
    public ResponseEntity<List<Map<String, Object>>> getTodayBranchReservations(@PathVariable Long id){
        List<Map<String, Object>> reservations = reservationService.getTodayReservationsOfBranch(id);
        return new ResponseEntity<>(reservations, HttpStatus.OK);
    }
}
