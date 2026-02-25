package com.medibook.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterPatientRequest {
    @NotBlank
    private String username;
    
    @NotBlank
    private String password;
    
    @NotBlank
    private String fullName;
    
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    private String phone;
    
    private LocalDate dateOfBirth;
    private String gender;
}