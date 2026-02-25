package com.medibook.controller;

import com.medibook.entity.Doctor;
import com.medibook.entity.User;
import com.medibook.repository.DoctorRepository;
import com.medibook.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DoctorController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @GetMapping("/public/all")
    public ResponseEntity<List<Doctor>> getAllDoctorsPublic() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return doctorRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Doctor> getDoctorByUserId(@PathVariable Long userId) {
        return doctorRepository.findByUserId(userId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/verified")
    public ResponseEntity<List<Doctor>> getVerifiedDoctors() {
        return ResponseEntity.ok(doctorRepository.findByVerified(true));
    }

    @GetMapping("/specialization/{spec}")
    public ResponseEntity<List<Doctor>> getDoctorsBySpecialization(@PathVariable String spec) {
        return ResponseEntity.ok(doctorRepository.findBySpecialization(spec));
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<?> updateDoctorProfile(@PathVariable Long userId, @RequestBody Map<String, Object> profileData) {
        try {
            Optional<Doctor> doctorOpt = doctorRepository.findByUserId(userId);
            if (!doctorOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Doctor doctor = doctorOpt.get();
            User user = doctor.getUser();

            // Update user info
            if (profileData.containsKey("name")) {
                user.setName(profileData.get("name").toString());
            }
            if (profileData.containsKey("phone")) {
                user.setPhone(profileData.get("phone").toString());
            }
            userRepository.save(user);

            // Update doctor info
            if (profileData.containsKey("specialization")) {
                doctor.setSpecialization(profileData.get("specialization").toString());
            }
            if (profileData.containsKey("qualification")) {
                doctor.setQualification(profileData.get("qualification").toString());
            }
            if (profileData.containsKey("experience") && profileData.get("experience") != null) {
                doctor.setExperience(Integer.parseInt(profileData.get("experience").toString()));
            }
            if (profileData.containsKey("consultationFee") && profileData.get("consultationFee") != null) {
                doctor.setConsultationFee(new BigDecimal(profileData.get("consultationFee").toString()));
            }
            if (profileData.containsKey("hospitalName")) {
                doctor.setHospitalName(profileData.get("hospitalName").toString());
            }
            if (profileData.containsKey("hospitalAddress")) {
                doctor.setHospitalAddress(profileData.get("hospitalAddress").toString());
            }
            if (profileData.containsKey("about")) {
                doctor.setAbout(profileData.get("about").toString());
            }
            if (profileData.containsKey("licenseNumber")) {
                doctor.setLicenseNumber(profileData.get("licenseNumber").toString());
            }

            doctorRepository.save(doctor);

            return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}