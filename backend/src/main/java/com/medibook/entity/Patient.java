package com.medibook.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "patients")
@Data
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private LocalDate dateOfBirth;
    
    private String gender;
    
    @Column(length = 500)
    private String address;
    
    private String bloodGroup;
    
    @Column(length = 1000)
    private String medicalHistory;
    
    @Column(length = 50)
    private String emergencyContact;
}