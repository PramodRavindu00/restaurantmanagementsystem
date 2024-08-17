package com.project.backend.service;

import com.project.backend.model.Reservation;
import com.project.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService  {
    private final ReservationRepository reservationRepository;
    private final ReservationService reservationService;

    public Reservation addReservation(Reservation reservation) {
        String reservationNo = reservationService.generateNextReservationNo();
        reservation.setReservationNo(reservationNo);
        return reservationRepository.save(reservation);
    }

    public List<Reservation> getCustomerReservations(Long Id) {
        return reservationRepository.findByCustomerID(Id);
    }
}
