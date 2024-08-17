package com.project.backend.repository;

import com.project.backend.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByCustomerID(Long customerId);

    @Query("SELECT r.reservationNo from Reservation r ORDER BY r.Id DESC LIMIT 1")
    String findLastReservationNo();
}
