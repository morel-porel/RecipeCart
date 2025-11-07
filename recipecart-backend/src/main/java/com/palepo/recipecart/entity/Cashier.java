package com.palepo.recipecart.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cashiers")
public class Cashier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cashier_id", nullable = false, unique = true)
    private Integer cashierId;

    @Column(name = "employee_name", nullable = false)
    private String employeeName;

    public Cashier() {}

    public Cashier(Integer cashierId, String employeeName) {
        this.cashierId = cashierId;
        this.employeeName = employeeName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCashierId() {
        return cashierId;
    }

    public void setCashierId(Integer cashierId) {
        this.cashierId = cashierId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }
}