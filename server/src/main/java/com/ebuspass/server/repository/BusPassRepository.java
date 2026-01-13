package com.ebuspass.server.repository;

import com.ebuspass.server.model.BusPass;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BusPassRepository extends MongoRepository<BusPass, String> {
    BusPass findFirstByCreatedByOrderByCreatedAtDesc(String createdBy);
    List<BusPass> findAllByCreatedByOrderByCreatedAtDesc(String createdBy);
    BusPass findByRollno(String rollno);
    List<BusPass> findAllByOrderByCreatedAtDesc();
}
