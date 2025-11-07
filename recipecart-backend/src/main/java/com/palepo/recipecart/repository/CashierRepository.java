package com.palepo.recipecart.repository;

import com.palepo.recipecart.entity.Cashier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CashierRepository extends JpaRepository<Cashier, Long> {
    Optional<Cashier> findByCashierId(Integer cashierId);
}