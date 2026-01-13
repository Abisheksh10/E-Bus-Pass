package com.ebuspass.server.service;

import com.ebuspass.server.model.Admin;
import com.ebuspass.server.model.Registration;
import com.ebuspass.server.repository.AdminRepository;
import com.ebuspass.server.repository.RegistrationRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final RegistrationRepository registrationRepository;
    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(RegistrationRepository registrationRepository, AdminRepository adminRepository) {
        this.registrationRepository = registrationRepository;
        this.adminRepository = adminRepository;
    }

    public Registration register(String username, String email, String passwordRaw) {
        String hash = encoder.encode(passwordRaw);
        Registration user = new Registration(username, email, hash, "student");
        return registrationRepository.save(user);
    }

    public boolean emailExists(String email) {
        return registrationRepository.findByEmail(email).isPresent();
    }

    public Registration findUserByEmail(String email) {
        return registrationRepository.findByEmail(email).orElse(null);
    }

    public Admin findAdminByMail(String mail) {
        return adminRepository.findByMail(mail).orElse(null);
    }

    public boolean passwordMatches(String raw, String hashed) {
        return encoder.matches(raw, hashed);
    }
}
