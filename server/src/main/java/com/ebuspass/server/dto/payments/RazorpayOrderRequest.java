package com.ebuspass.server.dto.payments;

public class RazorpayOrderRequest {
    private Long amountPaise;
    private String passId;

    // ✅ for renewal flow
    private String purpose;   // "renewal"
    private String startDate; // YYYY-MM-DD

    public Long getAmountPaise() { return amountPaise; }
    public void setAmountPaise(Long amountPaise) { this.amountPaise = amountPaise; }

    public String getPassId() { return passId; }
    public void setPassId(String passId) { this.passId = passId; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
}
