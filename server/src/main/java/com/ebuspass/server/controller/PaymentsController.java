package com.ebuspass.server.controller;

import com.ebuspass.server.dto.payments.RazorpayOrderRequest;
import com.ebuspass.server.dto.payments.RazorpayVerifyRequest;
import com.ebuspass.server.model.BusPass;
import com.ebuspass.server.repository.BusPassRepository;
import com.ebuspass.server.service.PassesService;
import com.ebuspass.server.service.RazorpayService;
import com.razorpay.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentsController {

    private final RazorpayService razorpayService;
    private final BusPassRepository busPassRepository;
    private final PassesService passesService;

    public PaymentsController(RazorpayService razorpayService,
                              BusPassRepository busPassRepository,
                              PassesService passesService) {
        this.razorpayService = razorpayService;
        this.busPassRepository = busPassRepository;
        this.passesService = passesService;
    }

    // ✅ SAME OLD endpoint name
    @PostMapping("/create-checkout")
    public ResponseEntity<?> createCheckout(@RequestBody RazorpayOrderRequest req) {
        try {
            Long amountPaise = req.getAmountPaise();
            String passId = req.getPassId();

            if (amountPaise == null || amountPaise < 100) {
                return ResponseEntity.status(400).body(Map.of("message", "Invalid amount"));
            }
            if (passId == null || passId.isBlank()) {
                return ResponseEntity.status(400).body(Map.of("message", "Missing passId"));
            }

            BusPass pass = busPassRepository.findById(passId).orElse(null);
            if (pass == null) return ResponseEntity.status(404).body(Map.of("message", "Pass not found"));

            // ✅ If this is renewal, compute & store pending renewal validity BEFORE payment
            String purpose = req.getPurpose();
            if (purpose != null && purpose.equalsIgnoreCase("renewal")) {
                String startDate = req.getStartDate();
                if (startDate == null || startDate.isBlank()) {
                    // fallback: renew from current validTill, else today
                    startDate = (pass.getValidTill() != null && !pass.getValidTill().isBlank())
                            ? pass.getValidTill()
                            : LocalDate.now().toString();
                }

                PassesService.ValidityOut v = passesService.computeValidity(startDate, pass.getPassType());

                pass.setPaymentPurpose("renewal");
                pass.setPendingRenewFrom(v.validFrom);
                pass.setPendingRenewTill(v.validTill);
                pass.setPendingRenewDatevalid(v.datevalid);
            } else {
                // normal payment (initial registration)
                pass.setPaymentPurpose(null);
                pass.setPendingRenewFrom(null);
                pass.setPendingRenewTill(null);
                pass.setPendingRenewDatevalid(null);
            }

            // Create Razorpay order
            String receipt = "pass_" + passId;
            Order order = razorpayService.createOrder(amountPaise, receipt);

            pass.setPaymentGateway("razorpay");
            pass.setRazorpayOrderId(order.get("id"));
            busPassRepository.save(pass);

            return ResponseEntity.ok(Map.of(
                    "key", razorpayService.getKeyId(),
                    "orderId", order.get("id"),
                    "amount", amountPaise,
                    "currency", "INR",
                    "passId", passId
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Razorpay order error"));
        }
    }

    // ✅ SAME OLD-friendly name
    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody RazorpayVerifyRequest req) {
        try {
            String passId = req.getPassId();
            String orderId = req.getRazorpay_order_id();
            String paymentId = req.getRazorpay_payment_id();
            String signature = req.getRazorpay_signature();

            if (passId == null || orderId == null || paymentId == null || signature == null) {
                return ResponseEntity.status(400).body(Map.of("message", "Missing fields"));
            }

            boolean ok = razorpayService.verifySignature(orderId, paymentId, signature);
            if (!ok) return ResponseEntity.status(400).body(Map.of("message", "Invalid signature"));

            BusPass pass = busPassRepository.findById(passId).orElse(null);
            if (pass == null) return ResponseEntity.status(404).body(Map.of("message", "Pass not found"));

            // mark paid
            pass.setPaid(true);
            pass.setPaymentGateway("razorpay");
            pass.setRazorpayOrderId(orderId);
            pass.setRazorpayPaymentId(paymentId);

            // ✅ APPLY renewal validity AFTER successful payment verification
            if ("renewal".equalsIgnoreCase(pass.getPaymentPurpose())) {
                if (pass.getPendingRenewFrom() != null && pass.getPendingRenewTill() != null) {
                    pass.setValidFrom(pass.getPendingRenewFrom());
                    pass.setValidTill(pass.getPendingRenewTill());
                    pass.setDatevalid(pass.getPendingRenewDatevalid());
                }

                // clear pending renewal state
                pass.setPaymentPurpose(null);
                pass.setPendingRenewFrom(null);
                pass.setPendingRenewTill(null);
                pass.setPendingRenewDatevalid(null);
            }

            busPassRepository.save(pass);

            return ResponseEntity.ok(Map.of("ok", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Verify error"));
        }
    }
}
