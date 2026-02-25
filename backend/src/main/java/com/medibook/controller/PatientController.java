package com.medibook.controller;

import com.medibook.entity.*;
import com.medibook.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getPatientProfile(@PathVariable Long userId) {
        try {
            Optional<Patient> patientOpt = patientRepository.findByUserId(userId);
            if (patientOpt.isPresent()) {
                Patient patient = patientOpt.get();
                Map<String, Object> response = new HashMap<>();
                response.put("id", patient.getId());
                response.put("dateOfBirth", patient.getDateOfBirth());
                response.put("gender", patient.getGender());
                response.put("bloodGroup", patient.getBloodGroup());
                response.put("address", patient.getAddress());
                response.put("emergencyContact", patient.getEmergencyContact());
                
                // Add user info
                Map<String, Object> userInfo = new HashMap<>();
                if (patient.getUser() != null) {
                    userInfo.put("name", patient.getUser().getName());
                    userInfo.put("email", patient.getUser().getEmail());
                    userInfo.put("phone", patient.getUser().getPhone());
                }
                response.put("user", userInfo);
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<?> updatePatientProfile(@PathVariable Long userId, @RequestBody Map<String, Object> profileData) {
        try {
            // Find patient by user ID
            Optional<Patient> patientOpt = patientRepository.findByUserId(userId);
            if (!patientOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            Patient patient = patientOpt.get();
            User user = patient.getUser();
            
            // Update user info
            if (profileData.containsKey("name")) {
                user.setName(profileData.get("name").toString());
            }
            if (profileData.containsKey("phone")) {
                user.setPhone(profileData.get("phone").toString());
            }
            userRepository.save(user);
            
            // Update patient info
            if (profileData.containsKey("gender")) {
                patient.setGender(profileData.get("gender").toString());
            }
            if (profileData.containsKey("bloodGroup")) {
                patient.setBloodGroup(profileData.get("bloodGroup").toString());
            }
            if (profileData.containsKey("address")) {
                patient.setAddress(profileData.get("address").toString());
            }
            if (profileData.containsKey("emergencyContact")) {
                patient.setEmergencyContact(profileData.get("emergencyContact").toString());
            }
            
            patientRepository.save(patient);
            
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}