package com.project.backend.controller;

import com.project.backend.model.Product;
import com.project.backend.repository.ProductRepository;
import com.project.backend.service.AdminService;
import com.project.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;
    @Autowired
    private ProductService productService;
    @Autowired
    private ProductRepository productRepository;

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

    //@PutMapping("/productImageChange/{productId}")
//    public ResponseEntity<Product> ChangeProductImage(@PathVariable Long productId, @RequestParam("imageFile") MultipartFile image) throws IOException {
//        try {
//            if (!productRepository.existsById(productId)) {
//                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//            }
//
//            Product product = adminService.changeProductImage(productId, image);
//            return new ResponseEntity<>(product, HttpStatus.OK);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    @PutMapping("/editProduct/{id}")
    public ResponseEntity<String> editProduct(@PathVariable Long id,@RequestBody Product product) {
       String productName = product.getProductName();
       if(productService.isProductNameUsingOther(id,productName)){
           return new ResponseEntity<>("Exists", HttpStatus.BAD_REQUEST);
       }else{
          Product editedProduct = adminService.editProduct(id,product);
          if(editedProduct != null){
              return new ResponseEntity<>(editedProduct.getProductNo(), HttpStatus.OK);
          }else{
              return new ResponseEntity<>("Not found", HttpStatus.NOT_FOUND);
          }
       }
    }

}
