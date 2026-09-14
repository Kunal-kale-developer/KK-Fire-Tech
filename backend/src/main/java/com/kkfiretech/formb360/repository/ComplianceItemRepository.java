package com.kkfiretech.formb360.repository;

import com.kkfiretech.formb360.entity.ComplianceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ComplianceItemRepository extends JpaRepository<ComplianceItem, Long> {

    List<ComplianceItem> findByBuildingId(Long buildingId);

    @Query("select c from ComplianceItem c where c.validUntil <= :cutoff order by c.validUntil asc")
    List<ComplianceItem> findExpiringBy(@Param("cutoff") LocalDate cutoff);

    @Query("select c from ComplianceItem c where c.validUntil < :today order by c.validUntil asc")
    List<ComplianceItem> findExpired(@Param("today") LocalDate today);
}
