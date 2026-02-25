package com.medibook.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    
    // Doctor specific fields
    private String specialization;
    private String qualification;
    private String experience;
    private String consultationFee;
    private String hospitalName;
    private String licenseNumber;
}