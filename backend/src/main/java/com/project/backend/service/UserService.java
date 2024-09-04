package com.project.backend.service;

import com.project.backend.model.Branch;
import com.project.backend.model.User;
import com.project.backend.repository.BranchRepository;
import com.project.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BranchRepository branchRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean isEmailTaken(String email) {
       try {
           return userRepository.findByEmail(email).isPresent();
       }
       catch (Exception e){
           throw new RuntimeException("error occurred while checking if email is taken: "+e);
       }
    }

    public boolean isPhoneTaken(String phone) {
        try {
        return userRepository.findByPhone(phone).isPresent();
    }
       catch (Exception e){
        throw new RuntimeException("error occurred while checking if phone no is taken: "+e);
    }
    }

    public User newUser(User user) {
      try {
          String passwordEncoded = passwordEncoder.encode(user.getPassword());
          user.setPassword(passwordEncoded);
          return userRepository.save(user);
      }
      catch (Exception e){
          throw new RuntimeException("error occurred while creating new user: "+e);
      }

    }

    public User findByEmail(String email){
       try {
           return userRepository.findByEmail(email).orElse(null);
       }
       catch (Exception e){
           throw new RuntimeException("error occurred while fetching user by email: "+e);
       }
    }

    public String findUserNameByID(Long id) {
        try {
        return  userRepository.getUserNameByID(id);
    }
       catch (Exception e){
        throw new RuntimeException("error occurred while fetching user name by ID: "+e);
    }
    }

    public String findUserEmailByID(Long id) {
        try {
        return userRepository.getUserEmailByID(id);
        }
        catch (Exception e){
            throw new RuntimeException("error occurred while fetching user name by ID: "+e);
        }
    }

    public List<Map<String, Object>> getAllStaff() {
        try {
        List<Map<String, Object>> list = new ArrayList<>();
        String userType = "Customer";
        List<User> staffList = userRepository.findUsersByUserType(userType);

        for (User staff : staffList) {
            Long branchID = staff.getBranch();
            Optional<Branch> branch = branchRepository.findById(branchID);

            if (branch.isPresent()) {
                String branchName = branch.get().getName();
                Map<String, Object> staffMap = new HashMap<>();
                staffMap.put("id", staff.getId());
                staffMap.put("firstName", staff.getFirstName());
                staffMap.put("lastName", staff.getLastName());
                staffMap.put("email", staff.getEmail());
                staffMap.put("phone", staff.getPhone());
                staffMap.put("userType", staff.getUserType());
                staffMap.put("branchID",staff.getBranch());
                staffMap.put("branch", branchName);
                list.add(staffMap);
            }
        }
        return list;
        }
        catch (Exception e){
            throw new RuntimeException("error occurred while fetching all staff");
        }

    }

    public boolean isEmailTakenByAnotherUser(Long id, String email) {
        try {
            return userRepository.emailTakenWhenUpdating(id, email) > 0;
        }
        catch (Exception e){
            throw new RuntimeException("error occurred while checking if email is using by another user: "+e);
        }
    }

    public boolean isPhoneTakenByAnotherUser(Long id, String phone) {
        try {
            return userRepository.phoneTakenWhenUpdating(id, phone) > 0;
        }
        catch (Exception e){
            throw new RuntimeException("error occurred while checking if phone no is using by another user: "+e);
        }
    }
}
