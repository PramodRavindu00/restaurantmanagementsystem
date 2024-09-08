package com.project.backend.service;

import com.project.backend.model.CustomerOrder;
import com.project.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

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

}
