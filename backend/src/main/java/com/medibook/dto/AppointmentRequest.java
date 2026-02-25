package com.medibook.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentRequest {
    private Long doctorId;
    private Long patientId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String reason;
    private String notes;
}