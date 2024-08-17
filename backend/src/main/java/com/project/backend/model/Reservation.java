package com.project.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;



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
    private String phone;
    private Long seats;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime time;
    private String status;
    private String info;
}
