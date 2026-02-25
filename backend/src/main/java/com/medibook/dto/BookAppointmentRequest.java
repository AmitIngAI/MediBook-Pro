package com.medibook.dto;

import lombok.Data;

@Data
public class BookAppointmentRequest {
    private Long patientId;
    private Long doctorId;
    private String date;
    private String timeSlot;
    private String type;
    private String notes;
}