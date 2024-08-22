package com.project.backend.service;

import com.project.backend.ResourceNotFoundException;
import com.project.backend.model.Branch;
import com.project.backend.model.Reservation;
import com.project.backend.repository.BranchRepository;
import com.project.backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class CustomerService  {
    private final ReservationRepository reservationRepository;
    private final ReservationService reservationService;
    private final BranchRepository branchRepository;

    public Reservation addReservation(Reservation reservation){
        Reservation newReservation = null;

        try {
            String reservationNo = reservationService.generateNextReservationNo();
            reservation.setReservationNo(reservationNo);

            newReservation = reservationRepository.save(reservation);

            reservationService.sendConfirmationEmail(newReservation);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save reservation or send email", e);
        }
        return newReservation;
    }

    public Reservation updateReservation(Long id , Reservation reservation) throws ResourceNotFoundException {
        Optional<Reservation> existingReservationOpt = reservationRepository.findById(id);
        if(existingReservationOpt.isEmpty()) {
            throw new ResourceNotFoundException("Reservation not found");
        }
        Reservation existingReservation = existingReservationOpt.get();
        existingReservation.setBranch(reservation.getBranch());
        existingReservation.setTime(reservation.getTime());
        existingReservation.setDate(reservation.getDate());
        existingReservation.setPhone(reservation.getPhone());
        existingReservation.setSeats(reservation.getSeats());
        existingReservation.setInfo(reservation.getInfo());
        return reservationRepository.save(existingReservation);
    }

    public Reservation cancelReservation(Long id) throws ResourceNotFoundException {
        Optional<Reservation> existingReservationOpt = reservationRepository.findById(id);
        if(existingReservationOpt.isEmpty()) {
            throw new ResourceNotFoundException("Reservation not found");
        }
        Reservation exisitngReservation = existingReservationOpt.get();
        exisitngReservation.setStatus("Cancelled");
        return reservationRepository.save(exisitngReservation);
    }

    public List<Map<String, Object>> getCustomerReservations(Long Id) {
        List<Map<String, Object>> list = new ArrayList<>();
        List<Reservation> reservationList = reservationRepository.findByCustomerID(Id);
        for (Reservation reservation : reservationList) {
            Long branchID = reservation.getBranch();
            Optional<Branch> branch = branchRepository.findById(branchID);

            if (branch.isPresent()) {
                String branchName = branch.get().getName();
                Map<String, Object> reservationMap = new HashMap<>();
                reservationMap.put("id", reservation.getId());
                reservationMap.put("customerID", reservation.getCustomerID());
                reservationMap.put("reservationNo", reservation.getReservationNo());
                reservationMap.put("status", reservation.getStatus());
                reservationMap.put("date", reservation.getDate());
                reservationMap.put("time", reservation.getTime());
                reservationMap.put("phone", reservation.getPhone());
                reservationMap.put("seats", reservation.getSeats());
                reservationMap.put("branchID",reservation.getBranch());
                reservationMap.put("branch", branchName);
                reservationMap.put("info", reservation.getInfo());
                list.add(reservationMap);
            }
        }
        return list;
    }
    }
