package com.ebuspass.server.service;

import com.ebuspass.server.model.BusPass;
import com.ebuspass.server.repository.BusPassRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PassesService {

    private final BusPassRepository busPassRepository;

    public PassesService(BusPassRepository busPassRepository) {
        this.busPassRepository = busPassRepository;
    }

    public boolean rollExists(String rollno) {
        if (rollno == null || rollno.isBlank()) return false;
        return busPassRepository.findByRollno(rollno) != null;
    }

    public BusPass create(BusPass pass) {
        // ✅ Ensure validity always set even if caller forgets
        // If validFrom is missing, default to today (so old behavior still works)
        if (pass.getValidFrom() == null || pass.getValidFrom().isBlank()) {
            pass.setValidFrom(LocalDate.now().toString()); // YYYY-MM-DD
        }

        // If validTill/datevalid missing, compute it using validFrom + passType
        if (pass.getValidTill() == null || pass.getValidTill().isBlank()
                || pass.getDatevalid() == null || pass.getDatevalid().isBlank()) {

            ValidityOut v = computeValidity(pass.getValidFrom(), pass.getPassType());
            pass.setValidTill(v.validTill);
            pass.setDatevalid(v.datevalid);
        }

        return busPassRepository.save(pass);
    }

    public List<BusPass> listLatestFirst() {
        return busPassRepository.findAllByOrderByCreatedAtDesc();
    }

    public BusPass findByRollno(String rollno) {
        return busPassRepository.findByRollno(rollno);
    }

    public BusPass findById(String id) {
        return busPassRepository.findById(id).orElse(null);
    }

    public BusPass accept(String id) {
        BusPass pass = findById(id);
        if (pass == null) return null;
        pass.setIsAvailable(true);
        return busPassRepository.save(pass);
    }

    public boolean deleteById(String id) {
        BusPass pass = findById(id);
        if (pass == null) return false;
        busPassRepository.deleteById(id);
        return true;
    }

    // =========================
    // ✅ VALIDITY CALCULATION
    // =========================

    public static class ValidityOut {
        public final String validFrom; // YYYY-MM-DD
        public final String validTill; // YYYY-MM-DD
        public final String datevalid; // MMYYYY

        public ValidityOut(String validFrom, String validTill, String datevalid) {
            this.validFrom = validFrom;
            this.validTill = validTill;
            this.datevalid = datevalid;
        }
    }

    // ✅ Start date chosen by student; till calculated by passType
    public ValidityOut computeValidity(String startDate, String passType) {
        LocalDate start = LocalDate.parse(startDate); // YYYY-MM-DD

        int days;
        String pt = (passType == null) ? "monthly" : passType.toLowerCase();
        switch (pt) {
            case "weekly" -> days = 7;
            case "yearly" -> days = 365;
            default -> days = 30; // monthly
        }

        LocalDate till = start.plusDays(days);

        // For legacy field "datevalid" => MMYYYY using till date
        String mmYYYY = String.format("%02d%d", till.getMonthValue(), till.getYear());

        return new ValidityOut(start.toString(), till.toString(), mmYYYY);
    }
    public BusPass findLatestByCreatedBy(String userId) {
        if (userId == null || userId.isBlank()) return null;
        return busPassRepository.findFirstByCreatedByOrderByCreatedAtDesc(userId);
    }

    public List<BusPass> findAllByCreatedBy(String userId) {
        if (userId == null || userId.isBlank()) return List.of();
        return busPassRepository.findAllByCreatedByOrderByCreatedAtDesc(userId);
    }

}
