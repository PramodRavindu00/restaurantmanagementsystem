package com.project.backend.controller;

import com.project.backend.model.User;
import com.project.backend.repository.UserRepository;
import com.project.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<String> addUser(@RequestBody User user) {
        if(userService.isEmailTaken(user.getEmail())){
            return new ResponseEntity<>("EMAIL", HttpStatus.BAD_REQUEST);
        }

        if(userService.isPhoneTaken(user.getPhone())){
            return new ResponseEntity<>("PHONE", HttpStatus.BAD_REQUEST);
        }

        User NewUser = userService.newUser(user);
        return new ResponseEntity<>("User Created Successfully", HttpStatus.CREATED);
    }
}