package com.medibook.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DoctorRegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String specialization;
    private String qualification;
    private Integer experience;
    private BigDecimal consultationFee;
    private String hospitalName;
    private String hospitalAddress;
}