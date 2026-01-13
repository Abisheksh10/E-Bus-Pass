package com.ebuspass.server.repository;

import com.ebuspass.server.model.Admin;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AdminRepository extends MongoRepository<Admin, String> {
    Optional<Admin> findByMail(String mail);
}
