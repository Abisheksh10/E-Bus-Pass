package com.ebuspass.server.controller;

import com.ebuspass.server.dto.auth.AdminLoginRequest;
import com.ebuspass.server.dto.auth.LoginRequest;
import com.ebuspass.server.dto.auth.RegisterRequest;
import com.ebuspass.server.model.Admin;
import com.ebuspass.server.model.Registration;
import com.ebuspass.server.service.AuthService;
import com.ebuspass.server.service.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @GetMapping("/ping")
    public Map<String, Object> ping() {
        return Map.of("ok", true);
    }

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // Express: return res.status(400).json({ errors: errors.array() })
            List<Map<String, Object>> errors = new ArrayList<>();
            for (FieldError fe : bindingResult.getFieldErrors()) {
                Map<String, Object> e = new LinkedHashMap<>();
                e.put("msg", "Invalid value");      // express-validator default
                e.put("param", fe.getField());
                e.put("value", fe.getRejectedValue());
                errors.add(e);
            }
            return ResponseEntity.status(400).body(Map.of("errors", errors));
        }

        String username = req.getUsername();
        String email = req.getEmail();
        String password = req.getPassword();

        if (authService.emailExists(email)) {
            return ResponseEntity.status(409).body(Map.of("message", "User already exists"));
        }

        Registration user = authService.register(username, email, password);
        return ResponseEntity.status(201).body(Map.of("id", user.getId(), "email", user.getEmail()));
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        String email = req.getEmail();
        String password = req.getPassword();

        Registration user = authService.findUserByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        boolean ok = authService.passwordMatches(password, user.getPassword());
        if (!ok) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

        String token = jwtService.createToken(user.getId(), user.getRole(), user.getEmail());
        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .sameSite("None")
                .secure(true)
                .path("/")
                .maxAge(7*24*60*60)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("message", "Logged in", "role", user.getRole()));
    }

    // POST /api/auth/admin/login
    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody AdminLoginRequest req) {
        String mail = req.getMail();
        String password = req.getPassword();

        Admin admin = authService.findAdminByMail(mail);
        if (admin == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Admin not found"));
        }

        boolean ok = authService.passwordMatches(password, admin.getPassword());
        if (!ok) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

        String token = jwtService.createToken(admin.getId(), "admin", admin.getMail());
        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .sameSite("Lax")
                .secure(false)
                .path("/")
                .maxAge(Duration.ofDays(7))
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("message", "Admin logged in"));
    }

    // POST /api/auth/logout
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .sameSite("None")
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("message", "Logged out"));
    }

    // GET /api/auth/me
    @GetMapping("/me")
    public Map<String, Object> me(@CookieValue(value = "token", required = false) String token) {
        try {
            if (token == null || token.isBlank()) {
                return Map.of("user", null);
            }
            Claims claims = jwtService.verifyAndGetClaims(token);

            // Express returns decoded object; include id, role, email, iat, exp
            Map<String, Object> user = new LinkedHashMap<>();
            user.put("id", claims.get("id"));
            user.put("role", claims.get("role"));
            user.put("email", claims.get("email"));
            user.put("iat", claims.getIssuedAt() != null ? (claims.getIssuedAt().getTime() / 1000) : null);
            user.put("exp", claims.getExpiration() != null ? (claims.getExpiration().getTime() / 1000) : null);

            return Map.of("user", user);
        } catch (Exception e) {
            return Map.of("user", null);
        }
    }
}
