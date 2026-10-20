package com.kkfiretech.formb360.compliance.repository;

import com.kkfiretech.formb360.compliance.entity.ComplianceBuilding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ComplianceBuildingRepository extends JpaRepository<ComplianceBuilding, Long> {
    List<ComplianceBuilding> findByOrgIdOrderByIdDesc(Long orgId);
    Optional<ComplianceBuilding> findByIdAndOrgId(Long id, Long orgId);
}