package com.ebuspass.server.repository;

import com.ebuspass.server.model.Driver;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface DriverRepository extends MongoRepository<Driver, String> {
    Optional<Driver> findByDriverId(String driverId);
}
