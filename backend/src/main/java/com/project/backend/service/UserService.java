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

    public User newUser(User user) {
        String passwordEncoded = passwordEncoder.encode(user.getPassword());
        user.setPassword(passwordEncoded);
        return userRepository.save(user);
    }

    public boolean isEmailTaken(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public boolean isPhoneTaken(String phone) {
        return userRepository.findByPhone(phone).isPresent();
    }

    public User findByEmail(String email){
        return userRepository.findByEmail(email).orElse(null);
    }

    public List<Map<String, Object>> getAllStaff() {
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

    public boolean isEmailTakenByAnotherUser(Long id, String email) {
        return userRepository.emailTakenWhenUpdating(id, email) > 0;
    }

    public boolean isPhoneTakenByAnotherUser(Long id, String phone) {
        return userRepository.phoneTakenWhenUpdating(id, phone) > 0;
    }
}
