package com.project.backend.service;

import com.project.backend.model.Reservation;
import com.project.backend.repository.ReservationRepository;
import com.project.backend.util.EmailContent;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final EmailService emailService;
    private final BranchService branchService;
    private final UserService userService;

    public synchronized String generateNextReservationNo(){
        String lastReservationNo = reservationRepository.findLastReservationNo();
        int nextNumber =1;

        if(lastReservationNo != null){
            String subString = lastReservationNo.substring(3);
            nextNumber = Integer.parseInt(subString)+1;
        }

        return String.format("RES%03d", nextNumber);
    }

    @Async
    protected void sendConfirmationEmail(Reservation reservation) throws MessagingException {
        try {
            Long customerID = reservation.getCustomerID();
            String name = userService.findUserNameByID(customerID);
            String message = "Your reservation has been successfully received.<br>" +
                    "Reservation details<br>" +
                    "Reservation No: " + reservation.getReservationNo() + "<br>" +
                    "Selected Branch: " + branchService.findBranchNameByID(reservation.getBranch()) + "<br>" +
                    "Date: " + reservation.getDate() + "<br>" +
                    "Time: " + reservation.getTime() + "<br>" +
                    "No of seats: " + reservation.getSeats() + "<br>" +
                    "Contact no: " + reservation.getPhone() + "<br>";
            String htmlContent = new EmailContent().emailHtml(name, message);
            emailService.sendSimpleMail(userService.findUserEmailByID(customerID), "Reservation Received", htmlContent);
        } catch (MessagingException e) {
            throw new MessagingException("Failed to send confirmation email", e);
        }
    }

    @Async
    protected void sendAcceptanceEmail(Reservation reservation) throws MessagingException {
        try {
            Long customerID = reservation.getCustomerID();
            String name = userService.findUserNameByID(customerID);
            String message = "We are happy to inform that your reservation has been accepted.<br>" +
                    "Reservation details<br>" +
                    "Reservation No: " + reservation.getReservationNo() + "<br>" +
                    "Selected Branch: " + branchService.findBranchNameByID(reservation.getBranch()) + "<br>" +
                    "Date: " + reservation.getDate() + "<br>" +
                    "Time: " + reservation.getTime() + "<br>" +
                    "No of seats: " + reservation.getSeats() + "<br>" +
                    "Contact no: " + reservation.getPhone() + "<br><br>"+
                    "We looking forward to provide a better service and quality time for you<br>";
            String htmlContent = new EmailContent().emailHtml(name, message);
            emailService.sendSimpleMail(userService.findUserEmailByID(customerID), "Reservation Accepted", htmlContent);
        } catch (MessagingException e) {
            throw new MessagingException("Failed to send acceptance email", e);
        }
    }

    @Async
    protected void sendDeclineEmail(Reservation reservation) throws MessagingException {
        try {
            Long customerID = reservation.getCustomerID();
            String name = userService.findUserNameByID(customerID);
            String message = "We are sorry to inform you that we have to decline your reservation due to " +
                    "an unavoidable reason.<br>" +
                    "Reservation details<br>" +
                    "Reservation No: " + reservation.getReservationNo() + "<br>" +
                    "Selected Branch: " + branchService.findBranchNameByID(reservation.getBranch()) + "<br>" +
                    "Date: " + reservation.getDate() + "<br>" +
                    "Time: " + reservation.getTime() + "<br>" +
                    "We looking forward to provide a better service and quality time for you<br>";
            String htmlContent = new EmailContent().emailHtml(name, message);
            emailService.sendSimpleMail(userService.findUserEmailByID(customerID), "Reservation Declined", htmlContent);
        } catch (MessagingException e) {
            throw new MessagingException("Failed to send decline email", e);
        }
    }



//    public List<Reservation> getAllReservations(String status){
//        return reservationRepository.findAllByStatus(status);
//    }


    public List<Reservation> getAllReservations(){
        return reservationRepository.findAll();
    }

    public List<Reservation> getAllReservations(Long id){
return reservationRepository.findByBranch(id);
    }

    public List<Map<String, Object>>  getAllReservations(Long id, String status){
        List<Map<String, Object>> list = new ArrayList<>();
        List<Reservation> reservationList = reservationRepository.findByBranch(id,status);

        for(Reservation reservation : reservationList){
            Long branchId = reservation.getBranch();
            Long userID = reservation.getCustomerID();

            String branchName = branchService.findBranchNameByID(branchId);
            String userName = userService.findUserNameByID(userID);

            Map<String, Object> reservationMap = getStringObjectMap(reservation, userName, branchName);
            list.add(reservationMap);
        }
        return list;
    }

    public List<Map<String,Object>> getTodayReservationsOfBranch(Long id){
        List<Map<String,Object>> list = new ArrayList<>();
        LocalDate date = LocalDate.now();
        List<Reservation> reservationList = reservationRepository.findTodayReservation(id,date);
        for(Reservation reservation : reservationList){
            Long branchId = reservation.getBranch();
            Long userID = reservation.getCustomerID();

            String branchName = branchService.findBranchNameByID(branchId);
            String userName = userService.findUserNameByID(userID);

            Map<String, Object> reservationMap = getStringObjectMap(reservation, userName, branchName);
            list.add(reservationMap);
        }
        return list;
    }

    private static Map<String, Object> getStringObjectMap(Reservation reservation, String userName, String branchName) {
        Map<String, Object> reservationMap = new HashMap<>();
        reservationMap.put("id", reservation.getId());
        reservationMap.put("reservationNo", reservation.getReservationNo());
        reservationMap.put("customerName", userName);
        reservationMap.put("branchName", branchName);
        reservationMap.put("date", reservation.getDate());
        reservationMap.put("time", reservation.getTime());
        reservationMap.put("phone", reservation.getPhone());
        reservationMap.put("status", reservation.getStatus());
        reservationMap.put("seats", reservation.getSeats());
        reservationMap.put("info", reservation.getInfo());
        return reservationMap;
    }

}
