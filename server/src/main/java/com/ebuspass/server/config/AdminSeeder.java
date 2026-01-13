package com.ebuspass.server.config;

import com.ebuspass.server.model.Admin;
import com.ebuspass.server.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Value("${app.admin.seed:false}")
    private boolean seedEnabled;

    @Value("${app.admin.mail}")
    private String adminMail;

    @Value("${app.admin.password}")
    private String adminPassword;

    public AdminSeeder(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public void run(String... args) {
        if (!seedEnabled) return;

        boolean exists = adminRepository.findByMail(adminMail).isPresent();
        if (exists) {
            System.out.println("[AdminSeeder] Admin already exists: " + adminMail);
            return;
        }

        Admin admin = new Admin();
        admin.setMail(adminMail);
        admin.setPassword(encoder.encode(adminPassword));
        adminRepository.save(admin);

        System.out.println("[AdminSeeder] Admin created: " + adminMail);
    }
}
