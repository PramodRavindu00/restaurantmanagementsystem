package com.project.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productNo;
    private String productName;
    private double price;
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "orderId",nullable = false)
    @JsonBackReference
    private CustomerOrder customerOrder;
}
