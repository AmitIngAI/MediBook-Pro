package com.medibook.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterDoctorRequest {
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
    
    @NotBlank
    private String specialization;
    
    private Integer experience;
    
    @NotBlank
    private String qualification;
    
    @NotBlank
    private String licenseNumber;
}