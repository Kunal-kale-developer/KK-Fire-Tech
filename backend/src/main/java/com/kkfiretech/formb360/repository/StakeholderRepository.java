package com.kkfiretech.formb360.repository;

import com.kkfiretech.formb360.entity.Stakeholder;
import com.kkfiretech.formb360.enums.StakeholderRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StakeholderRepository extends JpaRepository<Stakeholder, Long> {
    List<Stakeholder> findByRole(StakeholderRole role);
}
