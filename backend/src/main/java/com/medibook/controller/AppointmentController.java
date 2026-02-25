package com.medibook.controller;

import com.medibook.entity.Doctor;
import com.medibook.entity.Appointment;
import com.medibook.entity.AppointmentStatus;
import com.medibook.entity.Patient;
import com.medibook.repository.AppointmentRepository;
import com.medibook.repository.DoctorRepository;
import com.medibook.repository.PatientRepository;
import com.medibook.repository.UserRepository;
import com.medibook.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Book Appointment
    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("Booking request received: " + request);

            Long userId = Long.parseLong(request.get("patientId").toString());
            Long doctorId = Long.parseLong(request.get("doctorId").toString());

            Patient patient = patientRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("Patient profile not found for user ID: " + userId));

            System.out.println("Found patient: " + patient.getId());

            Doctor doctor = doctorRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found: " + doctorId));

            System.out.println("Found doctor: " + doctor.getId());

            Appointment apt = new Appointment();
            apt.setPatient(patient);
            apt.setDoctor(doctor);

            if (request.get("appointmentDate") != null) {
                String dateStr = request.get("appointmentDate").toString();
                apt.setAppointmentDate(LocalDate.parse(dateStr));
                System.out.println("Date set: " + dateStr);
            }

            if (request.get("appointmentTime") != null) {
                String timeStr = request.get("appointmentTime").toString();
                if (!timeStr.contains(":")) {
                    timeStr = timeStr + ":00";
                }
                if (timeStr.length() == 5) {
                    timeStr = timeStr + ":00";
                }
                apt.setAppointmentTime(LocalTime.parse(timeStr));
                System.out.println("Time set: " + timeStr);
            }

            apt.setReason(request.get("reason") != null ? request.get("reason").toString() : "");
            apt.setNotes(request.get("notes") != null ? request.get("notes").toString() : "");
            apt.setFee(doctor.getConsultationFee());
            apt.setStatus(AppointmentStatus.PENDING);

            Appointment savedApt = appointmentRepository.save(apt);
            System.out.println("Appointment saved with ID: " + savedApt.getId());

            // Send booking email
            try {
                emailService.sendAppointmentBooked(
                        patient.getUser().getEmail(),
                        patient.getUser().getName(),
                        doctor.getUser().getName(),
                        apt.getAppointmentDate().toString(),
                        apt.getAppointmentTime().toString()
                );
            } catch (Exception e) {
                System.err.println("Email failed: " + e.getMessage());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Appointment booked successfully!");
            response.put("appointmentId", savedApt.getId());
            response.put("status", savedApt.getStatus().toString());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Error booking appointment: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get Patient Appointments
    @GetMapping("/patient/{userId}")
    public ResponseEntity<?> getPatientAppointments(@PathVariable Long userId) {
        try {
            System.out.println("Fetching appointments for user ID: " + userId);

            Optional<Patient> patientOpt = patientRepository.findByUserId(userId);

            if (!patientOpt.isPresent()) {
                System.out.println("No patient profile found for user ID: " + userId);
                return ResponseEntity.ok(new ArrayList<>());
            }

            Patient patient = patientOpt.get();
            System.out.println("Found patient ID: " + patient.getId());

            List<Appointment> appointments = appointmentRepository.findByPatientId(patient.getId());
            System.out.println("Found " + appointments.size() + " appointments");

            List<Map<String, Object>> response = new ArrayList<>();
            for (Appointment apt : appointments) {
                Map<String, Object> aptMap = new HashMap<>();
                aptMap.put("id", apt.getId());
                aptMap.put("appointmentDate", apt.getAppointmentDate() != null ? apt.getAppointmentDate().toString() : null);
                aptMap.put("appointmentTime", apt.getAppointmentTime() != null ? apt.getAppointmentTime().toString() : null);
                aptMap.put("status", apt.getStatus().toString());
                aptMap.put("reason", apt.getReason());
                aptMap.put("notes", apt.getNotes());
                aptMap.put("fee", apt.getFee());
                aptMap.put("prescription", apt.getPrescription());

                Map<String, Object> doctorInfo = new HashMap<>();
                if (apt.getDoctor() != null) {
                    doctorInfo.put("id", apt.getDoctor().getId());
                    doctorInfo.put("specialization", apt.getDoctor().getSpecialization());

                    Map<String, Object> doctorUser = new HashMap<>();
                    if (apt.getDoctor().getUser() != null) {
                        doctorUser.put("name", apt.getDoctor().getUser().getName());
                        doctorUser.put("email", apt.getDoctor().getUser().getEmail());
                    }
                    doctorInfo.put("user", doctorUser);
                }
                aptMap.put("doctor", doctorInfo);

                response.add(aptMap);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error fetching appointments: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Get Doctor Appointments by Doctor ID
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getDoctorAppointments(@PathVariable Long doctorId) {
        try {
            System.out.println("Fetching appointments for doctor ID: " + doctorId);
            List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
            System.out.println("Found " + appointments.size() + " appointments");

            List<Map<String, Object>> response = new ArrayList<>();
            for (Appointment apt : appointments) {
                Map<String, Object> aptMap = new HashMap<>();
                aptMap.put("id", apt.getId());
                aptMap.put("appointmentDate", apt.getAppointmentDate() != null ? apt.getAppointmentDate().toString() : null);
                aptMap.put("appointmentTime", apt.getAppointmentTime() != null ? apt.getAppointmentTime().toString() : null);
                aptMap.put("status", apt.getStatus().toString());
                aptMap.put("reason", apt.getReason());
                aptMap.put("notes", apt.getNotes());
                aptMap.put("fee", apt.getFee());
                aptMap.put("prescription", apt.getPrescription());

                Map<String, Object> patientInfo = new HashMap<>();
                if (apt.getPatient() != null) {
                    patientInfo.put("id", apt.getPatient().getId());

                    Map<String, Object> patientUser = new HashMap<>();
                    if (apt.getPatient().getUser() != null) {
                        patientUser.put("name", apt.getPatient().getUser().getName());
                        patientUser.put("email", apt.getPatient().getUser().getEmail());
                        patientUser.put("phone", apt.getPatient().getUser().getPhone());
                    }
                    patientInfo.put("user", patientUser);
                }
                aptMap.put("patient", patientInfo);

                response.add(aptMap);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error fetching doctor appointments: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get Doctor Appointments by User ID
    @GetMapping("/doctor/user/{userId}")
    public ResponseEntity<?> getDoctorAppointmentsByUserId(@PathVariable Long userId) {
        try {
            System.out.println("Fetching appointments for doctor user ID: " + userId);

            Optional<Doctor> doctorOpt = doctorRepository.findByUserId(userId);

            if (!doctorOpt.isPresent()) {
                System.out.println("No doctor profile found for user ID: " + userId);
                return ResponseEntity.ok(new ArrayList<>());
            }

            Doctor doctor = doctorOpt.get();
            System.out.println("Found doctor ID: " + doctor.getId());

            List<Appointment> appointments = appointmentRepository.findByDoctorId(doctor.getId());
            System.out.println("Found " + appointments.size() + " appointments");

            List<Map<String, Object>> response = new ArrayList<>();
            for (Appointment apt : appointments) {
                Map<String, Object> aptMap = new HashMap<>();
                aptMap.put("id", apt.getId());
                aptMap.put("appointmentDate", apt.getAppointmentDate() != null ? apt.getAppointmentDate().toString() : null);
                aptMap.put("appointmentTime", apt.getAppointmentTime() != null ? apt.getAppointmentTime().toString() : null);
                aptMap.put("status", apt.getStatus().toString());
                aptMap.put("reason", apt.getReason());
                aptMap.put("notes", apt.getNotes());
                aptMap.put("fee", apt.getFee());
                aptMap.put("prescription", apt.getPrescription());

                Map<String, Object> patientInfo = new HashMap<>();
                if (apt.getPatient() != null) {
                    patientInfo.put("id", apt.getPatient().getId());

                    Map<String, Object> patientUser = new HashMap<>();
                    if (apt.getPatient().getUser() != null) {
                        patientUser.put("name", apt.getPatient().getUser().getName());
                        patientUser.put("email", apt.getPatient().getUser().getEmail());
                        patientUser.put("phone", apt.getPatient().getUser().getPhone());
                    }
                    patientInfo.put("user", patientUser);
                }
                aptMap.put("patient", patientInfo);

                response.add(aptMap);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error fetching doctor appointments: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get All Appointments (Admin)
    @GetMapping("/all")
    public ResponseEntity<?> getAllAppointments() {
        try {
            List<Appointment> appointments = appointmentRepository.findAll();
            System.out.println("Total appointments in database: " + appointments.size());
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            System.err.println("Error fetching all appointments: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Confirm Appointment
    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirmAppointment(@PathVariable Long id) {
        try {
            Appointment apt = appointmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
            apt.setStatus(AppointmentStatus.CONFIRMED);
            appointmentRepository.save(apt);

            // Send confirmation email
            try {
                emailService.sendAppointmentConfirmed(
                        apt.getPatient().getUser().getEmail(),
                        apt.getPatient().getUser().getName(),
                        apt.getDoctor().getUser().getName(),
                        apt.getAppointmentDate().toString(),
                        apt.getAppointmentTime().toString()
                );
            } catch (Exception e) {
                System.err.println("Email failed: " + e.getMessage());
            }

            return ResponseEntity.ok(Map.of("message", "Appointment confirmed!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Cancel Appointment
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        try {
            Appointment apt = appointmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
            apt.setStatus(AppointmentStatus.CANCELLED);
            appointmentRepository.save(apt);

            // Send cancellation email
            try {
                emailService.sendAppointmentCancelled(
                        apt.getPatient().getUser().getEmail(),
                        apt.getPatient().getUser().getName(),
                        apt.getDoctor().getUser().getName(),
                        apt.getAppointmentDate().toString()
                );
            } catch (Exception e) {
                System.err.println("Email failed: " + e.getMessage());
            }

            return ResponseEntity.ok(Map.of("message", "Appointment cancelled!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Complete Appointment with Prescription
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeAppointment(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            Appointment apt = appointmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
            apt.setStatus(AppointmentStatus.COMPLETED);
            
            String prescription = null;
            if (body != null && body.containsKey("prescription")) {
                prescription = body.get("prescription");
                apt.setPrescription(prescription);
            }
            appointmentRepository.save(apt);

            // Send completion email with prescription
            try {
                emailService.sendAppointmentCompleted(
                        apt.getPatient().getUser().getEmail(),
                        apt.getPatient().getUser().getName(),
                        apt.getDoctor().getUser().getName(),
                        prescription
                );
            } catch (Exception e) {
                System.err.println("Email failed: " + e.getMessage());
            }

            return ResponseEntity.ok(Map.of("message", "Appointment completed!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}