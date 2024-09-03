package com.project.backend.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;



@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String orderNo;
    private Long customerId;
    private Long branchId;
    private String orderType;
    @Column(columnDefinition = "JSON")
    private String orderItems;
    private LocalDate orderDate;
    private String payType;
    private Double orderValue;
    private String phone;
}
