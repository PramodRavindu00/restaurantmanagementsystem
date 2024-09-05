package com.project.backend.controller;

import com.project.backend.model.Product;
import com.project.backend.service.AdminService;
import com.project.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;
    @Autowired
    private ProductService productService;

    @PostMapping("/addProduct")
    public ResponseEntity<String> addProduct(@RequestParam("productName") String productName,
                                             @RequestParam("price") String price,
                                             @RequestParam("description") String description,
                                             @RequestParam("image") MultipartFile image) {
        Product product = new Product();
        product.setProductName(productName);
        product.setPrice(Double.parseDouble(price));
        product.setDescription(description);
        if(productService.isProductExist(product.getProductName())){
            return new ResponseEntity<>("ProductExist", HttpStatus.BAD_REQUEST);
        }else{
            Product newProduct = adminService.addProduct(product,image);
            return new ResponseEntity<>(newProduct.getProductNo(), HttpStatus.CREATED);
        }
    }
}
