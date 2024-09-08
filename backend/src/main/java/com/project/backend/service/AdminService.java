package com.project.backend.service;

import com.project.backend.model.Product;
import com.project.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminService {
    @Autowired
    private ProductService productService;
    @Autowired
    private ProductRepository productRepository;

    public Product addProduct(Product product, MultipartFile image) {
        Product newProduct = null;
        try {
            String productNo = productService.generateNextProductNo();
            product.setProductNo(productNo);

            String imageURL = saveImage(image,productNo);
            product.setImageURL(imageURL);
            newProduct = productRepository.save(product);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save product", e);
        }
        return newProduct;
    }

    public Product editProduct(Long id, Product product) {
       Optional <Product> existingProductOpt = productRepository.findById(id);
        if(existingProductOpt.isPresent()){
          Product existingProduct = existingProductOpt.get();
          existingProduct.setProductName(product.getProductName());
          existingProduct.setDescription(product.getDescription());
          existingProduct.setPrice(product.getPrice());
          return productRepository.save(existingProduct);
        }else{
            return null;
        }
    }

//    public Product changeProductImage(Long id, MultipartFile image)  throws IOException {
//        Product product = productRepository.findById(id).orElseThrow(
//                () -> new RuntimeException("Failed to find product with id: " + id)
//        );
//
//        if(image != null && !image.isEmpty()){
//            String imageURL = saveImage(image,product.getProductNo());
//            product.setImageURL(imageURL);
//            productRepository.save(product);
//        }else {
//            throw new RuntimeException("Failed to find product with id: " + id);
//        }
//        product.setImageURL(image.getOriginalFilename());
//         productRepository.save(product);
//        return product;
//    }

    public String saveImage(MultipartFile image, String productNo) throws IOException {
        String path = new File("").getAbsolutePath() + "/images/products/";
        Path directoryPath = Paths.get(path);
        if (!Files.exists(directoryPath)) {
            Files.createDirectories(directoryPath);
        }

        String ext = image.getOriginalFilename().substring(image.getOriginalFilename().lastIndexOf("."));
        String newFileName = productNo + ext;
        File newFile = new File(path + newFileName);

        if (newFile.exists()) {
            newFile.delete();
        }

        image.transferTo(newFile);
        return newFileName;
    }



}
