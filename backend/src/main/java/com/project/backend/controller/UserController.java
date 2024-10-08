package com.project.backend.controller;

import com.project.backend.dto.LoginResponse;
import com.project.backend.model.User;
import com.project.backend.repository.UserRepository;
import com.project.backend.service.UserService;
import com.project.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
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

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody User user) {
        User existingUser = userService.findByEmail(user.getEmail());

        if(existingUser == null){
            return new ResponseEntity<>("User Not Found", HttpStatus.NOT_FOUND);
        }

        if(!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())){
            return new ResponseEntity<>("Wrong Password", HttpStatus.BAD_REQUEST);
        }

   String token = jwtUtil.generateToken(existingUser.getEmail(), existingUser.getUserType());
   String firstName = existingUser.getFirstName();
   String lastName = existingUser.getLastName();
   String email = existingUser.getEmail();
   String phone = existingUser.getPhone();
   Long id = existingUser.getId();
   Long branch = existingUser.getBranch();
   String userType = existingUser.getUserType();
        LoginResponse response = new LoginResponse(id,firstName,lastName,phone,branch,email,userType,token);
        return new ResponseEntity<> (response, HttpStatus.OK);
    }

    @GetMapping("/allStaff")
    public ResponseEntity<List<Map<String, Object>>> getAllStaff() {
        List<Map<String, Object>> allStaff = userService.getAllStaff();
        return new ResponseEntity<>(allStaff, HttpStatus.OK);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<String> editUser(@PathVariable Long id, @RequestBody User user) {
        Optional<User> currentUserOpt = userRepository.findById(id);
        if(currentUserOpt.isPresent()){
            User existingUser = currentUserOpt.get();
            if(userService.isEmailTakenByAnotherUser(id, user.getEmail())){
                return new ResponseEntity<>("EMAIL", HttpStatus.BAD_REQUEST);
            }
            if(userService.isPhoneTakenByAnotherUser(id, user.getPhone())){
                return new ResponseEntity<>("PHONE", HttpStatus.BAD_REQUEST);
            }
           existingUser.setFirstName(user.getFirstName());
            existingUser.setLastName(user.getLastName());
            existingUser.setEmail(user.getEmail());
            existingUser.setPhone(user.getPhone());
            existingUser.setBranch(user.getBranch());
            userRepository.save(existingUser);
            return new ResponseEntity<>("User Updated Successfully", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("User Not Found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getLoggedUser/{email}")
    public ResponseEntity<Object> getLoggedUser(@PathVariable String email) {
        User founderUser = userService.findByEmail(email);
        if(founderUser == null){
            return new ResponseEntity<>("User Not Found", HttpStatus.NOT_FOUND);
        }else{
            return new ResponseEntity<>(founderUser, HttpStatus.OK);
        }
    }
}