package com.ebuspass.server.dto.drivers;

import jakarta.validation.constraints.NotBlank;

public class CreateDriverRequest {
    @NotBlank private String id;
    @NotBlank private String name;
    @NotBlank private String phone;
    @NotBlank private String busno;
    @NotBlank private String route;

    public String getId() { return id; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getBusno() { return busno; }
    public String getRoute() { return route; }

    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setBusno(String busno) { this.busno = busno; }
    public void setRoute(String route) { this.route = route; }
}
