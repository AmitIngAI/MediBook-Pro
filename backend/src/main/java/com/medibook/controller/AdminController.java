package com.medibook.controller;

import com.medibook.entity.Doctor;
import com.medibook.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminController {

    @Autowired
    private DoctorRepository doctorRepository;

    @PutMapping("/doctors/{id}/verify")
    public ResponseEntity<?> verifyDoctor(@PathVariable Long id) {
        try {
            Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
            
            doctor.setVerified(true);
            doctor.setVerifiedAt(LocalDateTime.now());
            doctorRepository.save(doctor);
            
            return ResponseEntity.ok(Map.of("message", "Doctor verified successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/doctors/pending")
    public ResponseEntity<?> getPendingDoctors() {
        return ResponseEntity.ok(doctorRepository.findByVerified(false));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        // Implement stats logic
        return ResponseEntity.ok(Map.of(
            "totalDoctors", doctorRepository.count(),
            "verifiedDoctors", doctorRepository.findByVerified(true).size(),
            "pendingDoctors", doctorRepository.findByVerified(false).size()
        ));
    }
}