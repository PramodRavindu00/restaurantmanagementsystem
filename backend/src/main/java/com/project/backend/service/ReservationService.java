package com.project.backend.service;

import com.project.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationRepository reservationRepository;

    public synchronized String generateNextReservationNo(){
        String lastReservationNo = reservationRepository.findLastReservationNo();
        int nextNumber =1;

        if(lastReservationNo != null){
            String subString = lastReservationNo.substring(3);
            nextNumber = Integer.parseInt(subString)+1;
        }

        return String.format("RES%03d", nextNumber);
    }
}
