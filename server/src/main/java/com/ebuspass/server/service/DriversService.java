package com.ebuspass.server.service;

import com.ebuspass.server.model.Driver;
import com.ebuspass.server.repository.DriverRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriversService {

    private final DriverRepository driverRepository;

    public DriversService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    public List<Driver> listLatestFirst() {
        return driverRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public boolean driverIdExists(String driverId) {
        return driverRepository.findByDriverId(driverId).isPresent();
    }

    public Driver create(Driver d) {
        return driverRepository.save(d);
    }

    public Driver updateByMongoId(String mongoId, Driver patch) {
        Driver existing = driverRepository.findById(mongoId).orElse(null);
        if (existing == null) return null;

        if (patch.getDriverId() != null) existing.setDriverId(patch.getDriverId());
        if (patch.getName() != null) existing.setName(patch.getName());
        if (patch.getPhone() != null) existing.setPhone(patch.getPhone());
        if (patch.getBusno() != null) existing.setBusno(patch.getBusno());
        if (patch.getRoute() != null) existing.setRoute(patch.getRoute());

        return driverRepository.save(existing);
    }

    public boolean deleteByMongoId(String mongoId) {
        Driver existing = driverRepository.findById(mongoId).orElse(null);
        if (existing == null) return false;
        driverRepository.deleteById(mongoId);
        return true;
    }
}
