package com.project.backend.repository;

import com.project.backend.model.Branch;
import com.project.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByProductName(String name);

    @Query("SELECT p.productNo from Product p ORDER BY p.id DESC LIMIT 1")
    String findLastProductNo();
}
