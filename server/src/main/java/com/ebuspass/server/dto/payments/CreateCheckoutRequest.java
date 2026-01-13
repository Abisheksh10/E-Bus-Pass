package com.ebuspass.server.dto.payments;

public class CreateCheckoutRequest {
    private Object amountPaise;
    private Object passId;
    private Object passType;
    private Object route;

    public Object getAmountPaise() { return amountPaise; }
    public Object getPassId() { return passId; }
    public Object getPassType() { return passType; }
    public Object getRoute() { return route; }

    public void setAmountPaise(Object amountPaise) { this.amountPaise = amountPaise; }
    public void setPassId(Object passId) { this.passId = passId; }
    public void setPassType(Object passType) { this.passType = passType; }
    public void setRoute(Object route) { this.route = route; }
}
