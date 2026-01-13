package com.ebuspass.server.controller;

import com.ebuspass.server.config.AuthContext;
import com.ebuspass.server.dto.passes.CreatePassRequest;
import com.ebuspass.server.dto.passes.RenewPassRequest;
import com.ebuspass.server.dto.passes.SearchPassRequest;
import com.ebuspass.server.model.BusPass;
import com.ebuspass.server.service.PassPdfService;
import com.ebuspass.server.service.PassesService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/passes")
public class PassesController {

    private final PassesService passesService;
    private final PassPdfService passPdfService;

    public PassesController(PassesService passesService, PassPdfService passPdfService) {
        this.passesService = passesService;
        this.passPdfService = passPdfService;
    }

    // POST /api/passes  (authRequired)
    @PostMapping("")
    public ResponseEntity<?> create(@Valid @RequestBody CreatePassRequest req, BindingResult br) {
        if (br.hasErrors()) {
            // Express: { errors: errors.array() }
            List<Map<String, Object>> errors = new ArrayList<>();
            for (FieldError fe : br.getFieldErrors()) {
                Map<String, Object> e = new LinkedHashMap<>();
                e.put("msg", "Invalid value");
                e.put("param", fe.getField());
                e.put("value", fe.getRejectedValue());
                errors.add(e);
            }
            return ResponseEntity.status(400).body(Map.of("errors", errors));
        }

        try {
            if (passesService.rollExists(req.getRollno())) {
                return ResponseEntity.status(409).body(Map.of("message", "A pass for this roll number already exists"));
            }

            AuthContext.AuthUser user = AuthContext.get();

            BusPass pass = new BusPass();
            pass.setFname(req.getFname());
            pass.setLname(req.getLname());
            pass.setYear(req.getYear());
            pass.setBranch(req.getBranch());
            pass.setPhno(req.getPhno());
            pass.setAddress(req.getAddress());
            pass.setRollno(req.getRollno());
            PassesService.ValidityOut v = passesService.computeValidity(req.getStartDate(), req.getPassType());
            pass.setValidFrom(v.validFrom);
            pass.setValidTill(v.validTill);
            pass.setDatevalid(v.datevalid);


            pass.setSource(req.getSource());
            pass.setDestination(req.getDestination());
            pass.setPassType(req.getPassType());
            pass.setCreatedBy(user != null ? user.getId() : null);

            BusPass created = passesService.create(pass);
            return ResponseEntity.status(201).body(created);

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    // GET /api/passes  (authRequired + adminOnly)
    @GetMapping("")
    public ResponseEntity<?> list() {
        AuthContext.AuthUser user = AuthContext.get();
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        if (!"admin".equals(user.getRole())) return ResponseEntity.status(403).body(Map.of("message", "Admin only"));

        return ResponseEntity.ok(passesService.listLatestFirst());
    }

    // POST /api/passes/search  (public)
    @PostMapping("/search")
    public Map<String, Object> search(@RequestBody SearchPassRequest req) {
        String rollno = req.getRollno();
        BusPass pass = passesService.findByRollno(rollno);

        if (pass == null) return Map.of("code", "NOT_FOUND");
        if (!Boolean.TRUE.equals(pass.getIsAvailable())) return Map.of("code", "NOT_VERIFIED");
        return Map.of("code", "OK", "data", pass);
    }

    // POST /api/passes/renew  (public)
    @PostMapping("/renew")
    public ResponseEntity<?> renew(@RequestBody(required = false) RenewPassRequest req) {

        AuthContext.AuthUser user = AuthContext.get();
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));

        String rollno = (req == null) ? null : req.getRollno();

        BusPass pass;

        // ✅ If rollno given, allow admin to preview any, or owner only
        if (rollno != null && !rollno.isBlank()) {
            pass = passesService.findByRollno(rollno);
            if (pass == null) {
                return ResponseEntity.status(404).body(Map.of("message", "No record for roll number"));
            }

            boolean admin = "admin".equals(user.getRole());
            boolean owner = pass.getCreatedBy() != null && pass.getCreatedBy().equals(user.getId());

            if (!admin && !owner) {
                return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));
            }
        } else {
            // ✅ No rollno => "my renewal" mode (latest pass of logged-in user)
            pass = passesService.findLatestByCreatedBy(user.getId());
            if (pass == null) {
                return ResponseEntity.ok(Map.of("pass", null));
            }
        }

        // Current valid till
        String currentTill = pass.getValidTill();
        if (currentTill == null || currentTill.isBlank()) {
            currentTill = java.time.LocalDate.now().toString();
        }

        // Suggested renewal start = currentTill (extend from current end date)
        String suggestedStart = currentTill;

        PassesService.ValidityOut v = passesService.computeValidity(suggestedStart, pass.getPassType());

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("current", currentTill);
        out.put("nextValidTill", v.validTill);
        out.put("suggestedStartDate", suggestedStart);
        out.put("data", pass);

        return ResponseEntity.ok(out);
    }




    // POST /api/passes/:id/accept (authRequired + adminOnly)
    @PostMapping("/{id}/accept")
    public ResponseEntity<?> accept(@PathVariable String id) {
        AuthContext.AuthUser user = AuthContext.get();
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        if (!"admin".equals(user.getRole())) return ResponseEntity.status(403).body(Map.of("message", "Admin only"));

        BusPass updated = passesService.accept(id);
        if (updated == null) return ResponseEntity.status(404).body(Map.of("message", "Not found"));
        return ResponseEntity.ok(updated);
    }


    // DELETE /api/passes/:id (authRequired + adminOnly)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        AuthContext.AuthUser user = AuthContext.get();
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        if (!"admin".equals(user.getRole())) return ResponseEntity.status(403).body(Map.of("message", "Admin only"));

        boolean ok = passesService.deleteById(id);
        if (!ok) return ResponseEntity.status(404).body(Map.of("message", "Not found"));
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // GET /api/passes/my  (authRequired) -> returns latest pass of logged-in user
    @GetMapping("/my")
    public ResponseEntity<?> myPass() {
        AuthContext.AuthUser user = AuthContext.get();
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));

        BusPass pass = passesService.findLatestByCreatedBy(user.getId());
        // Return { pass: null } if no pass created yet (frontend handles)
        return ResponseEntity.ok(Map.of("pass", pass));
    }


    // GET /api/passes/:id/pdf  (public)
    @GetMapping("/{id}/pdf")
    public ResponseEntity<?> pdf(@PathVariable String id) {
        try {
            BusPass pass = passesService.findById(id);
            if (pass == null) return ResponseEntity.status(404).body(Map.of("message", "Pass not found"));

            AuthContext.AuthUser user = AuthContext.get();
            if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));

            boolean admin = "admin".equals(user.getRole());
            boolean owner = pass.getCreatedBy() != null && pass.getCreatedBy().equals(user.getId());

            if (!admin && !owner) {
                return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));
            }

            byte[] pdf = passPdfService.buildPassPdf(pass);
            System.out.println("[PDF] bytes=" + (pdf == null ? -1 : pdf.length));
            System.out.println("[PDF] head=" + (pdf != null && pdf.length > 5 ? new String(pdf, 0, 5) : "null"));

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=BusPass_" + safe(pass.getRollno()) + ".pdf")
                    .body(pdf);

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }


    private String safe(String s) {
        return s == null ? "" : s;
    }
}
