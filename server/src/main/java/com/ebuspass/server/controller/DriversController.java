package com.ebuspass.server.controller;

import com.ebuspass.server.config.AuthContext;
import com.ebuspass.server.dto.drivers.CreateDriverRequest;
import com.ebuspass.server.model.Driver;
import com.ebuspass.server.service.DriversService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/drivers")
public class DriversController {

    private final DriversService driversService;

    public DriversController(DriversService driversService) {
        this.driversService = driversService;
    }

    // Public list
    @GetMapping("")
    public List<Driver> list() {
        return driversService.listLatestFirst();
    }

    // Admin create
    @PostMapping("")
    public ResponseEntity<?> create(@Valid @RequestBody CreateDriverRequest req, BindingResult br) {
        AuthContext.AuthUser user = AuthContext.get();
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        if (!"admin".equals(user.getRole())) return ResponseEntity.status(403).body(Map.of("message", "Admin only"));

        if (br.hasErrors()) {
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
            if (driversService.driverIdExists(req.getId())) {
                return ResponseEntity.status(409).body(Map.of("message", "Driver ID already exists"));
            }

            Driver d = new Driver();
            d.setDriverId(req.getId());
            d.setName(req.getName());
            d.setPhone(req.getPhone());
            d.setBusno(req.getBusno());
            d.setRoute(req.getRoute());

            Driver created = driversService.create(d);
            return ResponseEntity.status(201).body(created);

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    // Admin update (mongo _id in path)
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Map<String, Object> body) {
        AuthContext.AuthUser user = AuthContext.get();
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        if (!"admin".equals(user.getRole())) return ResponseEntity.status(403).body(Map.of("message", "Admin only"));

        Driver patch = new Driver();
        if (body.containsKey("id")) patch.setDriverId(String.valueOf(body.get("id")));
        if (body.containsKey("name")) patch.setName(String.valueOf(body.get("name")));
        if (body.containsKey("phone")) patch.setPhone(String.valueOf(body.get("phone")));
        if (body.containsKey("busno")) patch.setBusno(String.valueOf(body.get("busno")));
        if (body.containsKey("route")) patch.setRoute(String.valueOf(body.get("route")));

        Driver updated = driversService.updateByMongoId(id, patch);
        if (updated == null) return ResponseEntity.status(404).body(Map.of("message", "Not found"));
        return ResponseEntity.ok(updated);
    }

    // Admin delete (mongo _id in path)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        AuthContext.AuthUser user = AuthContext.get();
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        if (!"admin".equals(user.getRole())) return ResponseEntity.status(403).body(Map.of("message", "Admin only"));

        boolean ok = driversService.deleteByMongoId(id);
        if (!ok) return ResponseEntity.status(404).body(Map.of("message", "Not found"));
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
