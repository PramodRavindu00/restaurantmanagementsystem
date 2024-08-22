package com.project.backend.service;

import com.project.backend.ResourceNotFoundException;
import com.project.backend.model.Reservation;
import com.project.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StaffService {
    @Autowired
    private final ReservationRepository reservationRepository;
    @Autowired
    private final ReservationService reservationService;

    public Reservation acceptReservation(Long reservationId) throws ResourceNotFoundException {
        Optional<Reservation> existingReservationOpt = reservationRepository.findById(reservationId);
        if(existingReservationOpt.isEmpty()) {
            throw new ResourceNotFoundException("Reservation not found");
        }  else{
            Reservation reservation = existingReservationOpt.get();
            if(!reservation.getStatus().equals("pending")){
                throw new RuntimeException("notPending");
            }
            else{
                try {
                    reservation.setStatus("Accepted");
                    reservationRepository.save(reservation);
                    reservationService.sendAcceptanceEmail(reservation);
                } catch (Exception e) {
                    throw new RuntimeException("failed", e);
                }
            }
            return reservation;
        }
    }
    public Reservation declineReservation(Long reservationId) throws ResourceNotFoundException {
        Optional<Reservation> existingReservationOpt = reservationRepository.findById(reservationId);
        if(existingReservationOpt.isEmpty()) {
            throw new ResourceNotFoundException("Reservation not found");
        }  else{
            Reservation reservation = existingReservationOpt.get();
            if(!reservation.getStatus().equals("pending")){
                throw new RuntimeException("notPending");
            }
            else{
                try {
                    reservation.setStatus("Declined");
                    reservationRepository.save(reservation);
                    reservationService.sendDeclineEmail(reservation);
                } catch (Exception e) {
                    throw new RuntimeException("failed", e);
                }
            }
            return reservation;
        }
    }
}
