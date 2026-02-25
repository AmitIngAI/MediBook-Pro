package com.medibook.repository;

import com.medibook.entity.Patient;
import com.medibook.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByUser(User user);
    Optional<Patient> findByUserId(Long userId);
}