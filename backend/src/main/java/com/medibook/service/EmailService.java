package com.medibook.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendAppointmentBooked(String patientEmail, String patientName, String doctorName, String date, String time) {
        sendEmail(
            patientEmail,
            "Appointment Booked - MediBook Pro",
            String.format(
                "Dear %s,\n\n" +
                "Your appointment has been booked successfully!\n\n" +
                "Details:\n" +
                "Doctor: Dr. %s\n" +
                "Date: %s\n" +
                "Time: %s\n\n" +
                "Please arrive 10 minutes early.\n\n" +
                "Thank you,\n" +
                "MediBook Pro Team",
                patientName, doctorName, date, time
            )
        );
    }

    public void sendAppointmentConfirmed(String patientEmail, String patientName, String doctorName, String date, String time) {
        sendEmail(
            patientEmail,
            "Appointment Confirmed - MediBook Pro",
            String.format(
                "Dear %s,\n\n" +
                "Great news! Your appointment has been confirmed.\n\n" +
                "Details:\n" +
                "Doctor: Dr. %s\n" +
                "Date: %s\n" +
                "Time: %s\n\n" +
                "Thank you,\n" +
                "MediBook Pro Team",
                patientName, doctorName, date, time
            )
        );
    }

    public void sendAppointmentCancelled(String patientEmail, String patientName, String doctorName, String date) {
        sendEmail(
            patientEmail,
            "Appointment Cancelled - MediBook Pro",
            String.format(
                "Dear %s,\n\n" +
                "Your appointment with Dr. %s on %s has been cancelled.\n\n" +
                "You can book a new appointment anytime.\n\n" +
                "Thank you,\n" +
                "MediBook Pro Team",
                patientName, doctorName, date
            )
        );
    }

    public void sendAppointmentCompleted(String patientEmail, String patientName, String doctorName, String prescription) {
        sendEmail(
            patientEmail,
            "Appointment Completed - MediBook Pro",
            String.format(
                "Dear %s,\n\n" +
                "Your appointment with Dr. %s has been completed.\n\n" +
                "Prescription:\n%s\n\n" +
                "Get well soon!\n\n" +
                "Thank you,\n" +
                "MediBook Pro Team",
                patientName, doctorName, prescription != null ? prescription : "No prescription provided"
            )
        );
    }

    private void sendEmail(String to, String subject, String text) {
        if (mailSender == null) {
            System.out.println("Email service not configured. Email to " + to + ": " + subject);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            message.setFrom("noreply@medibookpro.com");

            mailSender.send(message);
            System.out.println("Email sent to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}