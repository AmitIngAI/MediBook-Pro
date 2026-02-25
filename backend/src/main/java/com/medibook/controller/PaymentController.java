package com.medibook.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PaymentController {

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
        try {
            String amount = request.get("amount").toString();
            String appointmentId = request.get("appointmentId").toString();

            // Generate order ID
            String orderId = "order_" + UUID.randomUUID().toString().substring(0, 8);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", orderId);
            response.put("amount", amount);
            response.put("currency", "INR");
            response.put("appointmentId", appointmentId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, Object> request) {
        try {
            String paymentId = request.get("paymentId").toString();
            String orderId = request.get("orderId").toString();

            // In production, verify with Razorpay API
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment verified successfully");
            response.put("paymentId", paymentId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}