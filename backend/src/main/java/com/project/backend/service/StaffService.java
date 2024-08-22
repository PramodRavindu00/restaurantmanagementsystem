package com.project.backend.service;

import com.project.backend.ResourceNotFoundException;
import com.project.backend.model.Reservation;
import com.project.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StaffService {
    private final ReservationRepository reservationRepository;
    private final ReservationService reservationService;

    public Reservation acceptReservation(Long reservationId) throws ResourceNotFoundException {
        Optional<Reservation> existingReservationOpt = reservationRepository.findById(reservationId);
        if(existingReservationOpt.isEmpty()) {
            throw new ResourceNotFoundException("Reservation not found");
        }  else{
            Reservation reservation = existingReservationOpt.get();
            if(reservation.getStatus().equals("pending")){
                try {
                    reservation.setStatus("Accepted");
                    reservationRepository.save(reservation);
                    reservationService.sendAcceptanceEmail(reservation);
                } catch (Exception e) {
                    throw new RuntimeException("Failed to save accepted reservation or send email", e);
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
            if(reservation.getStatus().equals("pending")){
                try {
                    reservation.setStatus("Declined");
                    reservationRepository.save(reservation);
                    reservationService.sendDeclineEmail(reservation);
                } catch (Exception e) {
                    throw new RuntimeException("Failed to save declined reservation or send email", e);
                }
            }
            return reservation;
        }
    }
}
