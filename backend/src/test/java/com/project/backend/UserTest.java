package com.project.backend;

import com.project.backend.repository.UserRepository;
import com.project.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserTest {

//    @Autowired
//    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @BeforeEach
    public void setUp() {
    }

    @Test
    public void checkEmailExistsUsingExistingEmail(){
       String email = "pramod2000.ravindu@gmail.com";
       assertEquals(true,userService.isEmailTaken(email));
    }



    @Test
    public void checkEmailExistsUsingNonExistingEmail(){
        String email = "notexisitng@gmail.com";
        assertEquals(true,userService.isEmailTaken(email));
    }

    @Test
    public void checkPhoneNoExistsUsingExistingPhoneNo(){
        String phoneNo = "0767203699";
        assertEquals(true,userService.isPhoneTaken(phoneNo));
    }

    @Test
    public void checkPhoneNoExistsUsingNonExistingPhoneNo(){
        String phoneNo = "999999999";
        assertEquals(true,userService.isPhoneTaken(phoneNo));
    }
}
