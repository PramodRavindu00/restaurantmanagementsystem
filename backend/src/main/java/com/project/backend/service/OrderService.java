package com.project.backend.service;

import com.project.backend.model.CustomerOrder;
import com.project.backend.repository.OrderRepository;
import com.project.backend.util.EmailContent;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private BranchService branchService;

    @Autowired
    private EmailService emailService;

    public synchronized String generateNextOrderNo(){
        String lastOrderNo = orderRepository.findLastOrderNo();
        int nextNumber =1;

        if(lastOrderNo != null){
            String subString = lastOrderNo.substring(3);
            nextNumber = Integer.parseInt(subString)+1;
        }

        return String.format("ORD%03d", nextNumber);
    }

    public List<CustomerOrder> getAllOrders(){
        return orderRepository.findAll();
    }
    @Async
    protected void sendOrderReceivedEmail(CustomerOrder customerOrder) throws MessagingException {
        try {
            Long customerID = customerOrder.getCustomerId();
            String name = userService.findUserNameByID(customerID);
            String message = "Your order has been successfully received.<br>" +
                    "Order details<br>" +
                    "Order No: " + customerOrder.getOrderNo() + "<br>" +
                    "Selected Branch: " + branchService.findBranchNameByID(customerOrder.getBranch()) + "<br>" +
                    "Date: " + customerOrder.getOrderDate() + "<br>" +
                    "Contact no: " + customerOrder.getPhone() + "<br>";
            String htmlContent = new EmailContent().emailHtml(name, message);
            emailService.sendSimpleMail(userService.findUserEmailByID(customerID), "Order Received", htmlContent);
        } catch (MessagingException e) {
            throw new MessagingException("Failed to send order received email", e);
        }
    }

    @Async
    protected void sendOrderReceivedEmail(CustomerOrder customerOrder,String fileName,byte[] pdfReceipt) throws MessagingException {
        try {
            Long customerID = customerOrder.getCustomerId();
            String name = userService.findUserNameByID(customerID);
            String message = "Your Order Received.<br>" +
                    "Order details<br>" +
                    "Order No: " + customerOrder.getOrderNo() + "<br>" +
                    "Selected Branch: " + branchService.findBranchNameByID(customerOrder.getBranch()) + "<br>" +
                    "Date: " + customerOrder.getOrderDate() + "<br>" +
                    "Contact no: " + customerOrder.getPhone() + "<br>";
            String htmlContent = new EmailContent().emailHtml(name, message);
            emailService.sendSimpleMailWithAttachment(userService.findUserEmailByID(customerID),
                    "Order Received", htmlContent,fileName,pdfReceipt);
        } catch (MessagingException e) {
            throw new MessagingException("Failed to send order received email", e);
        }
    }

}
