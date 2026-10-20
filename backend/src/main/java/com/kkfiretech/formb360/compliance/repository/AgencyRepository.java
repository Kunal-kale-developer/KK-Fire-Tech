package com.kkfiretech.formb360.compliance.repository;

import com.kkfiretech.formb360.compliance.entity.Agency;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AgencyRepository extends JpaRepository<Agency, Long> {
    List<Agency> findByOrgIdOrderByIdDesc(Long orgId);
    Optional<Agency> findByIdAndOrgId(Long id, Long orgId);
    boolean existsByOrgIdAndLicenceNo(Long orgId, String licenceNo);
}