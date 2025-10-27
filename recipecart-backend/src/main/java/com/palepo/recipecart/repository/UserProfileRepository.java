package com.palepo.recipecart.repository;

import com.palepo.recipecart.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long>{
}