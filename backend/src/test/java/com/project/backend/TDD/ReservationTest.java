package com.project.backend.TDD;

import com.project.backend.service.ReservationService;
import com.project.backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class ReservationTest {

    @Autowired
    private ReservationService reservationService;
}
