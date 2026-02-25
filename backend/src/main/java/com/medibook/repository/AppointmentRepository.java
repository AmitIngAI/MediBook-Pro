package com.medibook.repository;

import com.medibook.entity.Appointment;
import com.medibook.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    List<Appointment> findByPatientId(Long patientId);
    
    List<Appointment> findByDoctorId(Long doctorId);
    
    List<Appointment> findByPatientIdAndStatus(Long patientId, AppointmentStatus status);
    
    List<Appointment> findByDoctorIdAndStatus(Long doctorId, AppointmentStatus status);
    
    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate date);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :date AND a.status != 'CANCELLED'")
    List<Appointment> findDoctorAppointmentsForDate(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate = :date")
    List<Appointment> findByDate(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = :status")
    Long countByStatus(@Param("status") AppointmentStatus status);
}