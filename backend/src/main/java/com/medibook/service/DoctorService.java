package com.medibook.service;

import com.medibook.entity.Doctor;
import com.medibook.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }
    
    public List<Doctor> getVerifiedDoctors() {
        return doctorRepository.findByVerified(true);
    }
    
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }
    
    public Optional<Doctor> getDoctorByUserId(Long userId) {
        return doctorRepository.findByUserId(userId);
    }
    
    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization);
    }
}