package com.ebuspass.server.repository;

import com.ebuspass.server.model.Registration;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RegistrationRepository extends MongoRepository<Registration, String> {
    Optional<Registration> findByEmail(String email);
}
