package com.medibook.service;

import com.medibook.dto.*;
import com.medibook.entity.*;
import com.medibook.repository.*;
import com.medibook.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public User registerPatient(RegisterRequest request) {
        // Validate mandatory fields
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }
        if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
            throw new RuntimeException("Phone is required");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        user.setPhone(request.getPhone());
        user.setRole(Role.PATIENT);
        User savedUser = userRepository.save(user);

        Patient patient = new Patient();
        patient.setUser(savedUser);
        patientRepository.save(patient);

        return savedUser;
    }

    public User registerDoctor(RegisterRequest request) {
        // Validate mandatory fields
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }
        if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
            throw new RuntimeException("Phone is required");
        }
        if (request.getSpecialization() == null || request.getSpecialization().trim().isEmpty()) {
            throw new RuntimeException("Specialization is required");
        }
        if (request.getQualification() == null || request.getQualification().trim().isEmpty()) {
            throw new RuntimeException("Qualification is required");
        }
        if (request.getExperience() == null || request.getExperience().trim().isEmpty()) {
            throw new RuntimeException("Experience is required");
        }
        if (request.getConsultationFee() == null || request.getConsultationFee().trim().isEmpty()) {
            throw new RuntimeException("Consultation Fee is required");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        user.setPhone(request.getPhone());
        user.setRole(Role.DOCTOR);
        User savedUser = userRepository.save(user);

        Doctor doctor = new Doctor();
        doctor.setUser(savedUser);
        doctor.setSpecialization(request.getSpecialization());
        doctor.setQualification(request.getQualification());
        doctor.setExperience(Integer.parseInt(request.getExperience()));
        doctor.setConsultationFee(new BigDecimal(request.getConsultationFee()));
        doctor.setHospitalName(request.getHospitalName());
        doctor.setLicenseNumber(request.getLicenseNumber());
        doctor.setVerified(false);
        doctorRepository.save(doctor);

        return savedUser;
    }

    public User registerAdmin(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        user.setPhone(request.getPhone());
        user.setRole(Role.ADMIN);
        userRepository.save(user);

        return user;
    }

    public JwtResponse login(LoginRequest request) {

    String email = request.getEmail().trim();
    String password = request.getPassword().trim();

    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(email, password)
    );

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));

    String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

    return new JwtResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
}
}