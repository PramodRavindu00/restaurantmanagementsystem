package com.project.backend.repository;

import com.project.backend.model.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BranchRepository extends JpaRepository<Branch, Long> {
    Optional<Branch> findByName(String name);

    @Query("SELECT b.name FROM Branch b WHERE b.id = :id")
    String findBranchNameById(@Param("id") Long id);

    @Query("SELECT b FROM Branch b WHERE b.active = true")
    List<Branch> findAllActive();

    @Query("SELECT COUNT(b.name) FROM Branch b WHERE b.name = :name AND b.id != :id")
    Long nameTakenWhenUpdating(@Param("id") Long id, @Param("name") String name);
}
