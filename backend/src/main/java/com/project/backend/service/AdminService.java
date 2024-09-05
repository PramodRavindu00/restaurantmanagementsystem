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

    public String saveImage(MultipartFile image, String productNo) throws IOException {
        String path = new File("").getAbsolutePath() + "/images/products/";
        Path directoryPath = Paths.get(path);
        if (!Files.exists(directoryPath)) {
            Files.createDirectories(directoryPath);
        }

        String ext = image.getOriginalFilename().substring(image.getOriginalFilename().lastIndexOf("."));
        String newFileName = productNo + ext;
        File newFile = new File(path + newFileName);
        image.transferTo(newFile);
        return newFileName;
    }

}
