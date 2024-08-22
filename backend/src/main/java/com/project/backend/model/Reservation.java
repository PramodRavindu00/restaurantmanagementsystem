package com.project.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;



@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reservation {
    @Id
    @GeneratedValue
    private Long Id;
    private LocalDate date;
    private String reservationNo;
    private Long customerID;
    private Long branch;
    private String phone;
    private Long seats;
    private String time;
    private String status;
    private String info;
}
