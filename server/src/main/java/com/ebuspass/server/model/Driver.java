package com.ebuspass.server.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "drivers")
public class Driver {

    // Mongo primary key (_id in Mongoose)
    @Id
    @JsonProperty("_id")
    private String _id;

    // Custom driver id field from Express body('id').notEmpty()
    @JsonProperty("id")
    @Indexed(unique = true)
    private String driverId;

    private String name;
    private String phone;
    private String busno;
    private String route;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public Driver() {}

    public String get_id() { return _id; }
    public String getDriverId() { return driverId; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getBusno() { return busno; }
    public String getRoute() { return route; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void set_id(String _id) { this._id = _id; }
    public void setDriverId(String driverId) { this.driverId = driverId; }
    public void setName(String name) { this.name = name; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setBusno(String busno) { this.busno = busno; }
    public void setRoute(String route) { this.route = route; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
