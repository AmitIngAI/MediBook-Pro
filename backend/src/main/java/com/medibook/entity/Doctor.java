package com.medibook.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctors")
@Data
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = true)
    private String specialization;
    
    @Column(nullable = true)
    private String qualification;
    
    @Column(nullable = true)
    private Integer experience;
    
    @Column(precision = 10, scale = 2, nullable = true)
    private BigDecimal consultationFee;
    
    @Column(nullable = true)
    private String hospitalName;
    
    @Column(length = 500, nullable = true)
    private String hospitalAddress;
    
    @Column(nullable = true)
    private String licenseNumber;
    
    @Column(nullable = false)
    private Boolean verified = false;
    
    @Column(name = "verified_at", nullable = true)
    private LocalDateTime verifiedAt;
    
    @Column(length = 1000, nullable = true)
    private String about;
    
    @Column(nullable = true)
    private Double rating = 0.0;
    
    @Column(nullable = true)
    private Integer totalReviews = 0;
}