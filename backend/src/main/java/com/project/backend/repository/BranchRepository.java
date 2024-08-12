package com.project.backend.repository;

import com.project.backend.model.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BranchRepository extends JpaRepository<Branch, Long> {
    Optional<Branch> findByName(String name);

    @Query("SELECT b FROM Branch b WHERE b.active = true")
    List<Branch> findAllActive();
}
