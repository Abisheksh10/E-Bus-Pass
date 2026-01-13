package com.ebuspass.server.dto.passes;

import jakarta.validation.constraints.NotBlank;

public class CreatePassRequest {

    @NotBlank private String fname;
    @NotBlank private String lname;
    @NotBlank private String year;
    @NotBlank private String branch;
    @NotBlank private String phno;
    @NotBlank private String address;

    @NotBlank private String rollno;

    @NotBlank private String source;
    @NotBlank private String destination;

    @NotBlank private String passType; // weekly/monthly/yearly
    @NotBlank
    private String startDate; // YYYY-MM-DD
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    // Optional fields coming from frontend (you can keep them if you want)
    private String busno;
    private String route;
    private Integer priceINR;
    private Integer distanceKm;
    private Boolean isAvailable;

    public String getFname() { return fname; }
    public void setFname(String fname) { this.fname = fname; }

    public String getLname() { return lname; }
    public void setLname(String lname) { this.lname = lname; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getPhno() { return phno; }
    public void setPhno(String phno) { this.phno = phno; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getRollno() { return rollno; }
    public void setRollno(String rollno) { this.rollno = rollno; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getPassType() { return passType; }
    public void setPassType(String passType) { this.passType = passType; }

    public String getBusno() { return busno; }
    public void setBusno(String busno) { this.busno = busno; }

    public String getRoute() { return route; }
    public void setRoute(String route) { this.route = route; }

    public Integer getPriceINR() { return priceINR; }
    public void setPriceINR(Integer priceINR) { this.priceINR = priceINR; }

    public Integer getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Integer distanceKm) { this.distanceKm = distanceKm; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
}
