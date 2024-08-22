package com.project.backend.repository;

import com.project.backend.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByCustomerID(Long customerId);

    @Query("SELECT r.reservationNo from Reservation r ORDER BY r.Id DESC LIMIT 1")
    String findLastReservationNo();

   @Query("SELECT r from Reservation r WHERE r.branch=:id ORDER BY r.date,r.time")
    List<Reservation> findByBranch(@Param("id") Long id);

    @Query("SELECT r from Reservation r WHERE r.branch=:id AND r.status =:status ORDER BY r.date,r.time")
    List<Reservation> findByBranch(@Param("id") Long id, @Param("status") String status);
}
