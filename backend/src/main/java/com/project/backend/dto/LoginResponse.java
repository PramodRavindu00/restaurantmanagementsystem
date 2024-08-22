package com.project.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private Long ID;
    private String firstName;
    private String lastName;
    private String phone;
    private Long branch;
    private String email;
    private String userType;
    private String token;
}
