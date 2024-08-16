package com.project.backend.repository;
import com.project.backend.model.User;
import org.hibernate.usertype.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);


    @Query("SELECT u FROM User u WHERE u.userType != :userType")
    List<User> findUsersByUserType(@Param("userType") String userType);

    @Query("SELECT COUNT(u.email) FROM User u WHERE u.email = :email AND u.id != :id")
    Long emailTakenWhenUpdating(@Param("id") Long id, @Param("email") String email);

    @Query("SELECT COUNT(u.phone) FROM User u WHERE u.phone = :phone AND u.id != :id")
    Long phoneTakenWhenUpdating(@Param("id") Long id, @Param("phone") String phone);
}
