//package com.project.backend.TDD;
//
//import com.project.backend.model.User;
//import com.project.backend.service.UserService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@SpringBootTest
//public class UserTest {
//
//    @Autowired
//    private UserService userService;
//
//    @BeforeEach
//    public void setUp() {
//    }
//
//    @Test
//    public void checkEmailExistsUsingExistingEmail(){
//       String email = "abcadmin@gmail.com";
//       assertEquals(true,userService.isEmailTaken(email));
//    }
//
//    @Test
//    public void checkEmailExistsUsingNonExistingEmail(){
//        String email = "notexisitng@gmail.com";
//        assertEquals(false,userService.isEmailTaken(email));
//    }
//
//    @Test
//    public void checkPhoneNoExistsUsingExistingPhoneNo(){
//        String phoneNo = "0767203699";
//        assertEquals(true,userService.isPhoneTaken(phoneNo));
//    }
//
//    @Test
//    public void checkPhoneNoExistsUsingNonExistingPhoneNo(){
//        String phoneNo = "999999999";
//        assertEquals(false,userService.isPhoneTaken(phoneNo));
//    }
//
//    @Test
//    public void addNewUser(){
//        User newUser = new User();
//       newUser.setEmail( "pramod2000.ravindu@gmail.com");
//       newUser.setFirstName("Pramod");
//       newUser.setLastName("Ravindu");
//       newUser.setPassword("password");
//        User user = userService.newUser(newUser);
//        assertNotNull(user);
//    }
//
//    @Test
//    public void findUserByExistingEmail(){
//        String email = "abcadmin@gmail.com";
//        assertNotNull(userService.findByEmail(email));
//    }
//
//    @Test
//    public void findUserByNonExistingEmail(){
//        String email = "noexists@gmail.com";
//        assertNull(userService.findByEmail(email));
//    }
//
//    @Test
//    public void findUserNameByExistingID(){
//        Long id = 1L;
//        assertNotNull(userService.findUserNameByID(id));
//    }
//
//    @Test
//    public void findUserNameByNonExistingID(){
//        Long id = 999L;
//        assertNull(userService.findUserNameByID(id));
//    }
//
//    @Test
//    public void findUserEmailByExistingID(){
//        Long id = 1L;
//        assertNotNull(userService.findUserEmailByID(id));
//    }
//
//    @Test
//    public void findUserEmailByNonExistingID(){
//        Long id = 999L;
//        assertNull(userService.findUserEmailByID(id));
//    }
//}
