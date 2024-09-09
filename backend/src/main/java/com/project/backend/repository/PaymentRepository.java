package com.project.backend.repository;

import com.project.backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query("SELECT p.paymentNo from Payment p ORDER BY p.id DESC LIMIT 1")
    String findLastPaymentNo();
}
