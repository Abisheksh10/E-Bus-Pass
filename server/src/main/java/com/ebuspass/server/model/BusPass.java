package com.ebuspass.server.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "buspasses")
public class BusPass {

    @Id
    @JsonProperty("_id")
    private String _id;

    private String fname;
    private String lname;
    private String year;
    private String branch;
    private String phno;
    private String address;

    @Indexed(unique = true)
    private String rollno;

    // legacy validity field used by older logic (MMYYYY)
    private String datevalid;

    // ✅ new day-level validity
    private String validFrom; // YYYY-MM-DD
    private String validTill; // YYYY-MM-DD

    private String source;
    private String destination;

    // weekly/monthly/yearly
    private String passType;

    private Boolean isAvailable = false;

    private String createdBy;

    // ===== Payments (Razorpay) =====
    private Boolean paid = false;
    private String paymentGateway;     // "razorpay"
    private String razorpayOrderId;
    private String razorpayPaymentId;

    // ===== Renewal tracking =====
    private String paymentPurpose;        // "renewal" (or null)
    private String pendingRenewFrom;      // YYYY-MM-DD
    private String pendingRenewTill;      // YYYY-MM-DD
    private String pendingRenewDatevalid; // MMYYYY

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public BusPass() {}

    public String getId() { return _id; }
    public String getFname() { return fname; }
    public String getLname() { return lname; }
    public String getYear() { return year; }
    public String getBranch() { return branch; }
    public String getPhno() { return phno; }
    public String getAddress() { return address; }
    public String getRollno() { return rollno; }
    public String getDatevalid() { return datevalid; }

    public String getValidFrom() { return validFrom; }
    public String getValidTill() { return validTill; }

    public String getSource() { return source; }
    public String getDestination() { return destination; }
    public String getPassType() { return passType; }
    public Boolean getIsAvailable() { return isAvailable; }
    public String getCreatedBy() { return createdBy; }

    public Boolean getPaid() { return paid; }
    public String getPaymentGateway() { return paymentGateway; }
    public String getRazorpayOrderId() { return razorpayOrderId; }
    public String getRazorpayPaymentId() { return razorpayPaymentId; }

    public String getPaymentPurpose() { return paymentPurpose; }
    public String getPendingRenewFrom() { return pendingRenewFrom; }
    public String getPendingRenewTill() { return pendingRenewTill; }
    public String getPendingRenewDatevalid() { return pendingRenewDatevalid; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    // ✅ FIXED: setId must use the parameter
    public void setId(String id) { this._id = id; }

    public void setFname(String fname) { this.fname = fname; }
    public void setLname(String lname) { this.lname = lname; }
    public void setYear(String year) { this.year = year; }
    public void setBranch(String branch) { this.branch = branch; }
    public void setPhno(String phno) { this.phno = phno; }
    public void setAddress(String address) { this.address = address; }
    public void setRollno(String rollno) { this.rollno = rollno; }
    public void setDatevalid(String datevalid) { this.datevalid = datevalid; }

    public void setValidFrom(String validFrom) { this.validFrom = validFrom; }
    public void setValidTill(String validTill) { this.validTill = validTill; }

    public void setSource(String source) { this.source = source; }
    public void setDestination(String destination) { this.destination = destination; }
    public void setPassType(String passType) { this.passType = passType; }
    public void setIsAvailable(Boolean available) { isAvailable = available; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public void setPaid(Boolean paid) { this.paid = paid; }
    public void setPaymentGateway(String paymentGateway) { this.paymentGateway = paymentGateway; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }

    public void setPaymentPurpose(String paymentPurpose) { this.paymentPurpose = paymentPurpose; }
    public void setPendingRenewFrom(String pendingRenewFrom) { this.pendingRenewFrom = pendingRenewFrom; }
    public void setPendingRenewTill(String pendingRenewTill) { this.pendingRenewTill = pendingRenewTill; }
    public void setPendingRenewDatevalid(String pendingRenewDatevalid) { this.pendingRenewDatevalid = pendingRenewDatevalid; }

    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
