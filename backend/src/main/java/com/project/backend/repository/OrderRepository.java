package com.project.backend.repository;


import com.project.backend.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {
    @Query("SELECT c.orderNo from CustomerOrder c ORDER BY c.id DESC LIMIT 1")
    String findLastOrderNo();

    @Query("SELECT o FROM CustomerOrder o Where o.customerId = :customerID ")
    List<CustomerOrder> findByCustomerID(@Param("customerID") Long customerID);

    @Query("SELECT o FROM CustomerOrder o Where o.orderNo = :refNo ")
    CustomerOrder findOrderByBillReference(@Param("refNo") String refNo);

    @Query("SELECT o FROM CustomerOrder  o WHERE o.branch =:branchId")
    List<CustomerOrder> findByBranchId(@Param("branchId") Long branchId);
}
