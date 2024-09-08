package com.project.backend.service;

import com.project.backend.model.Branch;
import com.project.backend.model.Product;
import com.project.backend.model.Reservation;
import com.project.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public synchronized String generateNextProductNo(){
        String lastReservationNo = productRepository.findLastProductNo();
        int nextNumber =1;

        if(lastReservationNo != null){
            String subString = lastReservationNo.substring(3);
            nextNumber = Integer.parseInt(subString)+1;
        }

        return String.format("PR%03d", nextNumber);
    }

    public boolean isProductExist(String productName){
        return productRepository.findByProductName(productName).isPresent();
    }

    public boolean isProductNameUsingOther(Long id, String name) {
        return productRepository.nameTakenWhenUpdating(id,name)>0;
    }

    public List<Map<String, Object>> getAllProducts(){

        List<Map<String, Object>> list = new ArrayList<>();
        List<Product> productList = productRepository.findAll();
        for (Product product : productList) {
            byte[] productImage = getProductImage(product.getImageURL());

                Map<String, Object> productMap = new HashMap<>();
            productMap.put("id", product.getId());
            productMap.put("productNo", product.getProductNo());
            productMap.put("productName", product.getProductName());
            productMap.put("description", product.getDescription());
            productMap.put("price", product.getPrice());
            productMap.put("image", productImage);

                list.add(productMap);

        }
        return list;
    }

    public Map<String, Object> getProduct(Long id) {
        Product product = productRepository.findById(id).orElse(null);
        Map<String, Object> productMap = null;
        if (product != null) {
            byte[] productImage = getProductImage(product.getImageURL());
            productMap = new HashMap<>();
            productMap.put("id", product.getId());
            productMap.put("productNo", product.getProductNo());
            productMap.put("productName", product.getProductName());
            productMap.put("description", product.getDescription());
            productMap.put("price", product.getPrice());
            productMap.put("image", productImage);

        }
        return productMap;
    }

    private byte[] getProductImage(String imageURL) {
        final String IMAGE_FOLDER = "./images/products/";
        try {
            Path imagepath = Paths.get(IMAGE_FOLDER+"/"+imageURL);
            return Files.readAllBytes(imagepath);
        }
        catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
