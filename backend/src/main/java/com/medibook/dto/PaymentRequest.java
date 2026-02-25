package com.medibook.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long appointmentId;
    private String token;
    private Double amount;
}